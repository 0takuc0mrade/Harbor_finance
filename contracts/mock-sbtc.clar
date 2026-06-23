;; Mock sBTC token for local/testnet demos only.

(define-fungible-token mock-sbtc)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-amount (err u101))
(define-constant err-not-token-owner (err u102))

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> amount u0) err-invalid-amount)
    (ft-mint? mock-sbtc amount recipient)
  )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) err-not-token-owner)
    (is-some memo)
    (ft-transfer? mock-sbtc amount sender recipient)
  )
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance mock-sbtc account))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply mock-sbtc))
)

(define-read-only (get-name)
  (ok "Mock sBTC")
)

(define-read-only (get-symbol)
  (ok "msBTC")
)

(define-read-only (get-decimals)
  (ok u8)
)
