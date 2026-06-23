import { initSimnet } from "@stacks/clarinet-sdk";
import { Cl } from "@stacks/transactions";
import { beforeEach, describe, expect, it } from "vitest";

type Simnet = Awaited<ReturnType<typeof initSimnet>>;

const RECEIVABLE_ID = 1;
const INVOICE_AMOUNT = 100_000;
const ADVANCE_AMOUNT = 80_000;
const YIELD_AMOUNT = 8_000;
const HASH_A = Cl.buffer(Uint8Array.from(Array(32).fill(1)));
const HASH_B = Cl.buffer(Uint8Array.from(Array(32).fill(2)));

let simnet: Simnet;
let admin: string;
let provider: string;
let business: string;
let other: string;

async function resetSimnet() {
  simnet = await initSimnet();
  const accounts = simnet.getAccounts();
  admin = simnet.deployer;
  provider = accounts.get("wallet_1")!;
  business = accounts.get("wallet_2")!;
  other = accounts.get("wallet_3")!;
}

function mint(amount: number, recipient: string) {
  return simnet.callPublicFn(
    "mock-sbtc",
    "mint",
    [Cl.uint(amount), Cl.standardPrincipal(recipient)],
    admin
  );
}

function submitReceivable(id = RECEIVABLE_ID) {
  return simnet.callPublicFn(
    "receivable-registry",
    "submit-receivable",
    [
      Cl.uint(id),
      HASH_A,
      Cl.uint(INVOICE_AMOUNT),
      Cl.uint(ADVANCE_AMOUNT),
      Cl.uint(simnet.blockHeight + 100),
      HASH_B,
    ],
    business
  );
}

function approveReceivable(id = RECEIVABLE_ID) {
  return simnet.callPublicFn(
    "receivable-registry",
    "approve-receivable",
    [Cl.uint(id), Cl.uint(ADVANCE_AMOUNT)],
    admin
  );
}

function depositLiquidity(amount = 500_000) {
  mint(amount, provider);
  return simnet.callPublicFn(
    "liquidity-pool",
    "deposit",
    [Cl.uint(amount)],
    provider
  );
}

function fundReceivable(id = RECEIVABLE_ID) {
  return simnet.callPublicFn(
    "liquidity-pool",
    "fund-receivable",
    [
      Cl.contractPrincipal(admin, "receivable-registry"),
      Cl.uint(id),
      Cl.standardPrincipal(business),
      Cl.uint(ADVANCE_AMOUNT),
    ],
    admin
  );
}

function getStatus(id = RECEIVABLE_ID) {
  return simnet.callReadOnlyFn(
    "receivable-registry",
    "get-receivable-status",
    [Cl.uint(id)],
    admin
  );
}

function getPoolStats() {
  return simnet.callReadOnlyFn("liquidity-pool", "get-pool-stats", [], admin);
}

beforeEach(async () => {
  await resetSimnet();
});

describe("Harbor Finance contracts", () => {
  it("mints and transfers mock sBTC", () => {
    expect(mint(1_000_000, provider).result).toEqual(Cl.ok(Cl.bool(true)));

    const transfer = simnet.callPublicFn(
      "mock-sbtc",
      "transfer",
      [
        Cl.uint(250_000),
        Cl.standardPrincipal(provider),
        Cl.standardPrincipal(business),
        Cl.none(),
      ],
      provider
    );

    expect(transfer.result).toEqual(Cl.ok(Cl.bool(true)));

    const providerBalance = simnet.callReadOnlyFn(
      "mock-sbtc",
      "get-balance",
      [Cl.standardPrincipal(provider)],
      provider
    );
    const businessBalance = simnet.callReadOnlyFn(
      "mock-sbtc",
      "get-balance",
      [Cl.standardPrincipal(business)],
      business
    );

    expect(providerBalance.result).toEqual(Cl.ok(Cl.uint(750_000)));
    expect(businessBalance.result).toEqual(Cl.ok(Cl.uint(250_000)));
  });

  it("deposits liquidity into the pool", () => {
    expect(depositLiquidity().result).toEqual(Cl.ok(Cl.bool(true)));

    const providerBalance = simnet.callReadOnlyFn(
      "liquidity-pool",
      "get-provider-balance",
      [Cl.standardPrincipal(provider)],
      provider
    );

    expect(providerBalance.result).toEqual(Cl.ok(Cl.uint(500_000)));
    expect(getPoolStats().result).toEqual(
      Cl.ok(
        Cl.tuple({
          "total-deposits": Cl.uint(500_000),
          "available-liquidity": Cl.uint(500_000),
          "deployed-liquidity": Cl.uint(0),
          "total-repaid": Cl.uint(0),
          "total-yield": Cl.uint(0),
        })
      )
    );
  });

  it("submits and approves a receivable", () => {
    expect(submitReceivable().result).toEqual(Cl.ok(Cl.bool(true)));
    expect(getStatus().result).toEqual(Cl.ok(Cl.uint(1)));

    expect(approveReceivable().result).toEqual(Cl.ok(Cl.bool(true)));
    expect(getStatus().result).toEqual(Cl.ok(Cl.uint(2)));
  });

  it("funds an approved receivable from pool liquidity", () => {
    expect(depositLiquidity().result).toEqual(Cl.ok(Cl.bool(true)));
    expect(submitReceivable().result).toEqual(Cl.ok(Cl.bool(true)));
    expect(approveReceivable().result).toEqual(Cl.ok(Cl.bool(true)));

    expect(fundReceivable().result).toEqual(Cl.ok(Cl.bool(true)));

    expect(getStatus().result).toEqual(Cl.ok(Cl.uint(3)));
    expect(getPoolStats().result).toEqual(
      Cl.ok(
        Cl.tuple({
          "total-deposits": Cl.uint(500_000),
          "available-liquidity": Cl.uint(420_000),
          "deployed-liquidity": Cl.uint(80_000),
          "total-repaid": Cl.uint(0),
          "total-yield": Cl.uint(0),
        })
      )
    );
  });

  it("records repayment and settles the receivable lifecycle", () => {
    expect(depositLiquidity().result).toEqual(Cl.ok(Cl.bool(true)));
    expect(submitReceivable().result).toEqual(Cl.ok(Cl.bool(true)));
    expect(approveReceivable().result).toEqual(Cl.ok(Cl.bool(true)));
    expect(fundReceivable().result).toEqual(Cl.ok(Cl.bool(true)));
    expect(mint(ADVANCE_AMOUNT + YIELD_AMOUNT, admin).result).toEqual(Cl.ok(Cl.bool(true)));

    const repayment = simnet.callPublicFn(
      "liquidity-pool",
      "record-repayment",
      [
        Cl.contractPrincipal(admin, "receivable-registry"),
        Cl.uint(RECEIVABLE_ID),
        Cl.uint(ADVANCE_AMOUNT),
        Cl.uint(YIELD_AMOUNT),
      ],
      admin
    );
    expect(repayment.result).toEqual(Cl.ok(Cl.bool(true)));
    expect(getStatus().result).toEqual(Cl.ok(Cl.uint(4)));

    const settlement = simnet.callPublicFn(
      "receivable-registry",
      "mark-settled",
      [Cl.uint(RECEIVABLE_ID)],
      admin
    );
    expect(settlement.result).toEqual(Cl.ok(Cl.bool(true)));
    expect(getStatus().result).toEqual(Cl.ok(Cl.uint(5)));
    expect(getPoolStats().result).toEqual(
      Cl.ok(
        Cl.tuple({
          "total-deposits": Cl.uint(500_000),
          "available-liquidity": Cl.uint(508_000),
          "deployed-liquidity": Cl.uint(0),
          "total-repaid": Cl.uint(80_000),
          "total-yield": Cl.uint(8_000),
        })
      )
    );
  });

  it("rejects invalid transitions and non-admin actions", () => {
    expect(depositLiquidity().result).toEqual(Cl.ok(Cl.bool(true)));
    expect(submitReceivable().result).toEqual(Cl.ok(Cl.bool(true)));

    expect(fundReceivable().result).toEqual(Cl.error(Cl.uint(202)));

    const earlySettlement = simnet.callPublicFn(
      "receivable-registry",
      "mark-settled",
      [Cl.uint(RECEIVABLE_ID)],
      admin
    );
    expect(earlySettlement.result).toEqual(Cl.error(Cl.uint(202)));

    const nonAdminApproval = simnet.callPublicFn(
      "receivable-registry",
      "approve-receivable",
      [Cl.uint(RECEIVABLE_ID), Cl.uint(ADVANCE_AMOUNT)],
      other
    );
    expect(nonAdminApproval.result).toEqual(Cl.error(Cl.uint(200)));

    const nonAdminFunding = simnet.callPublicFn(
      "liquidity-pool",
      "fund-receivable",
      [
        Cl.contractPrincipal(admin, "receivable-registry"),
        Cl.uint(RECEIVABLE_ID),
        Cl.standardPrincipal(business),
        Cl.uint(ADVANCE_AMOUNT),
      ],
      other
    );
    expect(nonAdminFunding.result).toEqual(Cl.error(Cl.uint(300)));

    expect(
      simnet.callPublicFn("receivable-registry", "reject-receivable", [Cl.uint(RECEIVABLE_ID)], admin).result
    ).toEqual(Cl.ok(Cl.bool(true)));

    expect(fundReceivable().result).toEqual(Cl.error(Cl.uint(202)));
  });
});
