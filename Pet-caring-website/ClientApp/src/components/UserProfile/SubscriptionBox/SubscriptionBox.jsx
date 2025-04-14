import React from 'react'

const SubscriptionBox = () => {
  return (
    <div className="space-y-3 rounded-xl bg-purple-700 p-6 text-white shadow-md">
      <h3 className="text-lg font-semibold">
        Индивидуальная подписка Success Premium
      </h3>
      <ul className="list-inside list-disc text-sm">
        <li>1 месяц Premium бесплатно</li>
        <li>2 месяца для учеников и студентов бесплатно</li>
        <li>Отмена в любой момент</li>
        <li>Лучшие акции, скидки и предложения ежемесячно</li>
      </ul>
      <button className="mt-2 rounded bg-white px-4 py-2 text-purple-700 hover:bg-gray-100">
        Подписаться
      </button>
    </div>
  );
}

export default SubscriptionBox