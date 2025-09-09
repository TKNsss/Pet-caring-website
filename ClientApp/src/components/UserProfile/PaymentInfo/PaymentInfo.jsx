import React from 'react'

const PaymentInfo = () => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md">
      <h3 className="text-md mb-2 font-semibold">Платежные данные</h3>
      <p className="text-sm">Номер карточки:</p>
      <p className="mb-4 font-mono text-lg tracking-widest">236 *** *** 265</p>
      <div className="grid grid-cols-2 gap-2">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Western_Union_2013_logo.svg"
          alt="WU"
          className="h-6"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Google_Pay_Logo.svg"
          alt="GPay"
          className="h-6"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
          alt="MasterCard"
          className="h-6"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
          alt="Visa"
          className="h-6"
        />
      </div>
    </div>
  );
}

export default PaymentInfo