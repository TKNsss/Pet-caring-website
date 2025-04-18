import React from 'react'

const CoursesTimeline = () => {
  const courses = [
    {
      title: "UX/UI Design — сайты",
      description: "Композиция, типографика, теория цвета...",
      lessons: 68,
      status: "Завершен",
      color: "bg-purple-100",
    },
    {
      title: "UX/UI Design — приложения",
      description: "Дизайн интерфейса мобильных приложений...",
      lessons: 12,
      status: "Завершен",
      color: "bg-pink-100",
    },
    {
      title: "UX/UI Design — анимация",
      description: "Анимация элементов в интерфейсе...",
      lessons: 12,
      status: "Начат: 13.06.2023г.",
      color: "bg-red-100",
    },
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="mb-4 text-lg font-bold">Мои курсы</h3>
      <ul className="space-y-4">
        {courses.map((course, i) => (
          <li
            key={i}
            className={`flex items-center justify-between rounded-lg p-4 ${course.color}`}
          >
            <div>
              <h4 className="font-semibold">{course.title}</h4>
              <p className="text-sm text-gray-600">{course.description}</p>
              <p className="text-xs text-gray-400">{course.lessons} уроков</p>
            </div>
            <div className="flex flex-col items-end text-right">
              <span
                className={`text-xs font-medium ${course.status.startsWith("Завершен") ? "text-green-600" : "text-blue-500"}`}
              >
                {course.status}
              </span>
              <button className="text-xl text-purple-600">➜</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CoursesTimeline