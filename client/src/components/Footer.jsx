const Footer = () => {
  return (
  <footer className="px-2 pt-8 sm:px-6 md:px-16 lg:px-36 w-full text-green-100 bg-[#101613] border-t border-green-900">
  <div className="flex flex-col md:flex-row justify-between w-full gap-6 md:gap-10 border-b border-green-900 pb-10">
  <div className="w-full md:max-w-96 mb-8 md:mb-0">
          <h1 className="text-green-300 text-2xl sm:text-3xl md:text-4xl font-medium">AgroSense</h1>
          <p className="mt-6 text-sm">
            Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/googlePlayBtnBlack.svg"
              alt="google play"
              className="h-10 w-auto border border-green-700 rounded"
            />
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/appleStoreBtnBlack.svg"
              alt="app store"
              className="h-10 w-auto border border-green-700 rounded"
            />
          </div>
        </div>
  <div className="w-full flex flex-col md:flex-row items-start md:justify-end gap-6 md:gap-20 lg:gap-40">
          <div>
            <h2 className="font-semibold mb-5 text-green-300">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Contact us</a>
              </li>
              <li>
                <a href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5 text-green-300">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+1-234-567-890</p>
              <p>contact@example.com</p>
            </div>
          </div>
        </div>
      </div>
  <p className="pt-4 text-center text-xs sm:text-sm pb-5 text-green-200">
        Copyright {new Date().getFullYear()} © AgroSense. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
