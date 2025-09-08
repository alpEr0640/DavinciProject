const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-6xl font-bold text-red-600 dark:text-red-500 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Sayfa Bulunamadı
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Aradığınız sayfa mevcut değil veya yanlış bir URL girdiniz. Lütfen
          doğru bağlantıyı kullanın.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Anasayfaya Dön
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
