;; Receivable lifecycle registry for the Harbor Finance MVP.
;; This contract records lifecycle/accounting state only; off-chain repayment remains mocked.

(define-constant contract-owner tx-sender)

(define-constant status-submitted u1)
(define-constant status-approved u2)
(define-constant status-funded u3)
(define-constant status-repaid u4)
(define-constant status-settled u5)
(define-constant status-rejected u6)
(define-constant status-defaulted u7)

(define-constant err-owner-only (err u200))
(define-constant err-not-found (err u201))
(define-constant err-invalid-status (err u202))
(define-constant err-already-exists (err u203))
(define-constant err-invalid-amount (err u204))
(define-constant err-invalid-due-height (err u205))

(define-map receivables
  uint
  {
    business: principal,
    debtor-hash: (buff 32),
    invoice-amount: uint,
    requested-advance-amount: uint,
    approved-advance-amount: uint,
    due-height: uint,
    metadata-hash: (buff 32),
    status: uint,
    created-at: uint,
    approved-by: (optional principal)
  }
)

(define-private (assert-owner)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok true)
  )
)

(define-private (load-receivable (receivable-id uint))
  (match (map-get? receivables receivable-id)
    receivable (ok receivable)
    err-not-found
  )
)

(define-private (assert-status (receivable-id uint) (expected-status uint))
  (let ((receivable (try! (load-receivable receivable-id))))
    (asserts! (is-eq (get status receivable) expected-status) err-invalid-status)
    (ok receivable)
  )
)

(define-public (submit-receivable
    (receivable-id uint)
    (debtor-hash (buff 32))
    (invoice-amount uint)
    (requested-advance-amount uint)
    (due-height uint)
    (metadata-hash (buff 32))
  )
  (begin
    (asserts! (is-none (map-get? receivables receivable-id)) err-already-exists)
    (asserts! (> invoice-amount u0) err-invalid-amount)
    (asserts! (> requested-advance-amount u0) err-invalid-amount)
    (asserts! (<= requested-advance-amount invoice-amount) err-invalid-amount)
    (asserts! (> due-height stacks-block-height) err-invalid-due-height)
    (map-set receivables receivable-id {
      business: tx-sender,
      debtor-hash: debtor-hash,
      invoice-amount: invoice-amount,
      requested-advance-amount: requested-advance-amount,
      approved-advance-amount: u0,
      due-height: due-height,
      metadata-hash: metadata-hash,
      status: status-submitted,
      created-at: stacks-block-height,
      approved-by: none
    })
    (ok true)
  )
)

(define-public (approve-receivable (receivable-id uint) (approved-advance-amount uint))
  (let ((receivable (try! (assert-status receivable-id status-submitted))))
    (try! (assert-owner))
    (asserts! (> approved-advance-amount u0) err-invalid-amount)
    (asserts! (<= approved-advance-amount (get invoice-amount receivable)) err-invalid-amount)
    (map-set receivables receivable-id (merge receivable {
      approved-advance-amount: approved-advance-amount,
      status: status-approved,
      approved-by: (some tx-sender)
    }))
    (ok true)
  )
)

(define-public (reject-receivable (receivable-id uint))
  (let ((receivable (try! (assert-status receivable-id status-submitted))))
    (try! (assert-owner))
    (map-set receivables receivable-id (merge receivable {
      status: status-rejected
    }))
    (ok true)
  )
)

(define-public (mark-funded (receivable-id uint))
  (let ((receivable (try! (assert-status receivable-id status-approved))))
    (try! (assert-owner))
    (map-set receivables receivable-id (merge receivable {
      status: status-funded
    }))
    (ok true)
  )
)

(define-public (mark-repaid (receivable-id uint))
  (let ((receivable (try! (assert-status receivable-id status-funded))))
    (try! (assert-owner))
    (map-set receivables receivable-id (merge receivable {
      status: status-repaid
    }))
    (ok true)
  )
)

(define-public (mark-settled (receivable-id uint))
  (let ((receivable (try! (assert-status receivable-id status-repaid))))
    (try! (assert-owner))
    (map-set receivables receivable-id (merge receivable {
      status: status-settled
    }))
    (ok true)
  )
)

(define-public (mark-defaulted (receivable-id uint))
  (let ((receivable (try! (assert-status receivable-id status-funded))))
    (try! (assert-owner))
    (map-set receivables receivable-id (merge receivable {
      status: status-defaulted
    }))
    (ok true)
  )
)

(define-read-only (get-receivable (receivable-id uint))
  (map-get? receivables receivable-id)
)

(define-read-only (get-receivable-status (receivable-id uint))
  (let ((receivable (unwrap! (map-get? receivables receivable-id) err-not-found)))
    (ok (get status receivable))
  )
)
