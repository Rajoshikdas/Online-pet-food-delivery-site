export default function CategoryCard({ title, image }) {
  return (
    <div className="group rounded-xl shadow-lg bg-white border border-gray-100 p-6 flex flex-col items-center gap-3 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-sky-100 to-yellow-100 flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <svg className="w-8 h-8 text-sky-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        )}
      </div>

      {/* Title */}
      <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-sky-600 transition-colors duration-200">
        {title}
      </span>
    </div>
  )
}