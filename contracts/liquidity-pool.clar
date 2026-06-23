;; Mock sBTC liquidity pool for Harbor Finance MVP demos.
;; The pool tracks simple pooled accounting; it intentionally does not implement share math.

(define-constant contract-owner tx-sender)

(define-constant err-owner-only (err u300))
(define-constant err-invalid-amount (err u301))
(define-constant err-insufficient-liquidity (err u302))
(define-constant err-insufficient-provider-balance (err u303))
(define-constant err-funding-not-found (err u304))
(define-constant err-already-funded (err u305))
(define-constant err-already-repaid (err u306))
(define-constant err-invalid-repayment (err u307))

(define-trait receivable-registry-trait
  (
    (mark-funded (uint) (response bool uint))
    (mark-repaid (uint) (response bool uint))
  )
)

(define-data-var total-deposits uint u0)
(define-data-var available-liquidity uint u0)
(define-data-var deployed-liquidity uint u0)
(define-data-var total-repaid uint u0)
(define-data-var total-yield uint u0)

(define-map provider-balances principal uint)

(define-map receivable-fundings
  uint
  {
    business: principal,
    amount: uint,
    repaid: bool,
    repaid-amount: uint,
    yield-amount: uint
  }
)

(define-private (assert-owner)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok true)
  )
)

(define-read-only (get-provider-balance (provider principal))
  (ok (default-to u0 (map-get? provider-balances provider)))
)

(define-read-only (get-pool-stats)
  (ok {
    total-deposits: (var-get total-deposits),
    available-liquidity: (var-get available-liquidity),
    deployed-liquidity: (var-get deployed-liquidity),
    total-repaid: (var-get total-repaid),
    total-yield: (var-get total-yield)
  })
)

(define-public (deposit (amount uint))
  (let ((current-balance (default-to u0 (map-get? provider-balances tx-sender))))
    (asserts! (> amount u0) err-invalid-amount)
    (try! (contract-call? .mock-sbtc transfer amount tx-sender (as-contract tx-sender) none))
    (map-set provider-balances tx-sender (+ current-balance amount))
    (var-set total-deposits (+ (var-get total-deposits) amount))
    (var-set available-liquidity (+ (var-get available-liquidity) amount))
    (ok true)
  )
)

(define-public (withdraw (amount uint))
  (let ((current-balance (default-to u0 (map-get? provider-balances tx-sender))))
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (<= amount current-balance) err-insufficient-provider-balance)
    (asserts! (<= amount (var-get available-liquidity)) err-insufficient-liquidity)
    (map-set provider-balances tx-sender (- current-balance amount))
    (var-set total-deposits (- (var-get total-deposits) amount))
    (var-set available-liquidity (- (var-get available-liquidity) amount))
    (try! (as-contract (contract-call? .mock-sbtc transfer amount tx-sender tx-sender none)))
    (ok true)
  )
)

(define-public (fund-receivable
    (registry <receivable-registry-trait>)
    (receivable-id uint)
    (business principal)
    (amount uint)
  )
  (begin
    (try! (assert-owner))
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (<= amount (var-get available-liquidity)) err-insufficient-liquidity)
    (asserts! (is-none (map-get? receivable-fundings receivable-id)) err-already-funded)
    (try! (contract-call? registry mark-funded receivable-id))
    (var-set available-liquidity (- (var-get available-liquidity) amount))
    (var-set deployed-liquidity (+ (var-get deployed-liquidity) amount))
    (map-set receivable-fundings receivable-id {
      business: business,
      amount: amount,
      repaid: false,
      repaid-amount: u0,
      yield-amount: u0
    })
    (try! (as-contract (contract-call? .mock-sbtc transfer amount tx-sender business none)))
    (ok true)
  )
)

(define-public (record-repayment
    (registry <receivable-registry-trait>)
    (receivable-id uint)
    (principal-amount uint)
    (yield-amount uint)
  )
  (let ((funding (unwrap! (map-get? receivable-fundings receivable-id) err-funding-not-found)))
    (try! (assert-owner))
    (asserts! (not (get repaid funding)) err-already-repaid)
    (asserts! (is-eq principal-amount (get amount funding)) err-invalid-repayment)
    (try! (contract-call? .mock-sbtc transfer (+ principal-amount yield-amount) tx-sender (as-contract tx-sender) none))
    (try! (contract-call? registry mark-repaid receivable-id))
    (var-set deployed-liquidity (- (var-get deployed-liquidity) principal-amount))
    (var-set available-liquidity (+ (var-get available-liquidity) principal-amount yield-amount))
    (var-set total-repaid (+ (var-get total-repaid) principal-amount))
    (var-set total-yield (+ (var-get total-yield) yield-amount))
    (map-set receivable-fundings receivable-id (merge funding {
      repaid: true,
      repaid-amount: principal-amount,
      yield-amount: yield-amount
    }))
    (ok true)
  )
)
