import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        language: "Language",
        english: "English",
        vietnamese: "Vietnamese",
        loading: "Loading...",
        buttons: {
          requestService: "Request Service",
        },
        search: {
          placeholder: "Search",
        },
      },
      nav: {
        brand: "HAPPY PET CARE",
        auth: {
          signup: "Sign up",
          login: "Log in",
        },
        toggle: {
          show: "Show links",
          hide: "Hide links",
        },
        links: {
          home: "Home",
          services: {
            title: "Our Services",
            items: {
              service1: "Service 1",
              service2: "Service 2",
              service3: "Service 3",
            },
          },
          about: {
            title: "About Us",
            why: "Why HPC",
            gallery: "Gallery",
          },
          contact: "Contact Us",
        },
      },
      home: {
        hero: {
          title:
            'ONLY THE <span class="text-darkYellow">BEST</span> FOR YOUR BESTIES',
          subtitle:
            'Provide pet care expertise in <span class="text-darkYellow">Allston, Brighton, Brookline, Chestnut Hill, Fenway, Kenmore, Newton Corner, MA</span>',
        },
        services: {
          heading:
            'Our <span class="text-[30px] text-[#6F32BE]">Services</span>',
          learnMore: "Learn more →",
          items: {
            dogWalking: {
              title: "Dog Walking",
              description:
                "Choose from a 30, 45, or 60-minute visit to give your pet their daily dose of fun-filled exercise.",
            },
            dogRunning: {
              title: "Dog Running",
              description:
                "Perfect for big dogs that need more exercise. Choose a 25 or 35-minute session to keep them active.",
            },
            dogBoarding: {
              title: "Dog Boarding",
              description:
                "Give your dogs the best day ever with our caring service from grooming to walking and playing.",
            },
            dogOvernight: {
              title: "Dog Overnight Care",
              description:
                "Heading out for the night? Let your dogs stay with us for every cuddle, walk, and treat they deserve.",
            },
            petInHome: {
              title: "Pet in-home visit",
              description:
                "For cats and dogs who feel best at home. We provide food, water, exercise, and attention while you are away.",
            },
            petTaxi: {
              title: "Pet Taxi",
              description:
                "Need a lift to the groomer, vet, or dog park? Our pet taxi covers every trip with care.",
            },
          },
        },
        achievements: {
          heading:
            'Our <span class="text-[30px] text-[#6F32BE]">numbers</span> tell more about us',
          items: {
            experience: "Years of experiences",
            happyClients: "Happy pets, Happy clients",
            professionals: "Professionals",
          },
        },
        reviews: {
          desktopHeading:
            'We\'ve earned <span class="text-[30px] text-[#6F32BE]">4.9 rating</span> on',
          button: "See Reviews →",
          mobileTitle: "Review on",
          mobileButton: "See Reviews",
          items: {
            khal:
              "So happy I found this place! They genuinely care about your pets and even water plants. Prices are reasonable for such thoughtful service.",
            thomas:
              "Happy Pet Care is the absolute BEST and the only people I trust with my precious cat. Over a year of amazing care!",
            elizabeth:
              "My dog loves walking with their friendly staff. The owner is very responsive and reliable — wonderful experience overall.",
            michael1:
              "Their team treats every pet like family. I always feel confident leaving my cat in their hands.",
            michael2:
              "Consistently outstanding care. They communicate well and truly love what they do.",
            michael3:
              "Highly recommend! Professional, kind, and attentive to every detail of my pet's routine.",
          },
        },
        gallery: {
          headingDesktop:
            'See Our <span class="text-primary text-3xl font-bold">Happy</span> Moments',
          headingMobile:
            'See Our <span class="text-primary">Happy</span> Moments',
          buttonDesktop: "See Gallery →",
          buttonMobile: "See Gallery",
          nextButton: "+",
        },
        footer: {
          title: "Bring Happiness to your pet",
          workingHoursTitle: "Working Hours",
          workingHours: [
            "Monday - Sunday: 10 am - 9 pm",
            "All holidays & school vacations",
          ],
          locationTitle: "Location",
          locationLine1: "Happy Pet Care 115 Sutherland",
          locationLine2: "Rd. Brighton, MA",
          contactTitle: "Contact",
          contactPrompt: "Got questions? Call us",
          phone: "617-600-351",
          followTitle: "Follow",
          brandTagline: "HAPPY PET CARE",
        },
      },
      gallery: {
        categories: {
          all: "All",
          dogWalking: "Dog Walking",
          dogRunning: "Dog Running",
          dogDayCare: "Dog Day Care",
          dogOvernight: "Dog Overnight Care",
          petInHome: "Pet In-home Visit",
          petTaxi: "Pet Taxi",
        },
        page: {
          heroTitle: "OUR HAPPY MOMENTS",
          heroSubtitle: "We bring joys and loves to your besties",
          footerTitle: "Bring Happiness to your pet",
          heading:
            'Your Pet Is Our <span class="text-[#6F32BE]">Family</span> Member',
          loadMore: "Load More",
          showLess: "Show Less",
        },
      },
      requestServices: {
        title: "Request Services",
        subtitle: "Please select any services you’re interested in and fill out the form",
        searchPlaceholder: "Find services here",
        status: {
          available: "(available) ✅",
          unavailable: "(unavailable) ❌",
        },
        labels: {
          selectServices: "Select Service(s)",
          perPet: "Per pet",
          bookNow: "Book Now",
          reviews: "reviews",
        },
        cards: {
          "dog-walking": {
            title: "Dog Walking",
            type: "Service",
            description:
              "Choose from a 30, 45, or 60-minute visit to give your pet their daily dose of fun-filled exercise.",
          },
          "dog-running": {
            title: "Dog Running",
            type: "Service",
            description:
              "Perfect for energetic pups that need a faster pace. Book 25 or 35-minute runs tailored to your dog’s stamina.",
          },
          "dog-boarding": {
            title: "Dog Boarding",
            type: "Service",
            description:
              "A cozy staycation for your dogs with daily play, grooming, and personalized care from our team.",
          },
          "dog-overnight-care": {
            title: "Dog Overnight Care",
            type: "Service",
            description:
              "Sleepovers done right—your pup stays with us overnight for walks, cuddles, and constant attention.",
          },
          "pet-in-home-visit": {
            title: "Pet in-home visit",
            type: "Service",
            description:
              "We visit cats and dogs right at home to feed them, refresh water, and keep them company while you’re away.",
          },
          "pet-taxi": {
            title: "Pet Taxi",
            type: "Service",
            description:
              "Need a ride to the vet, groomer, or dog park? Our door-to-door pet taxi makes every trip stress-free.",
          },
        },
      },
      auth: {
        labels: {
          showPassword: "Show password",
          forgotPassword: "Forgot password?",
        },
        google: {
          success: "Signed in with Google successfully!",
          error: "Google login failed. Please try again.",
        },
        github: {
          button: "Continue with GitHub",
          missingClientId:
            "GitHub Client ID is missing. Please contact support.",
          invalidCode: "GitHub returned an invalid code. Please try again.",
          invalidState:
            "GitHub authentication was not validated. Please try again.",
          success: "Signed in with GitHub successfully!",
          failure: "GitHub sign in failed. Please try again.",
          waitingTitle: "Authenticating with GitHub...",
          waitingSubtitle: "Please wait for a moment.",
        },
        forgotPassword: {
          missingEmail: "Please enter your email to reset the password!",
        },
        login: {
          divider: "OR",
          toggleHaveAccount: "Already have an account?",
          toggleNoAccount: "Don't have an account?",
          signIn: "Sign in",
          register: "Register",
        },
      },
    },
  },
  vi: {
    translation: {
      common: {
        language: "Ngôn ngữ",
        english: "English",
        vietnamese: "Tiếng Việt",
        loading: "Đang tải...",
        buttons: {
          requestService: "Đặt dịch vụ",
        },
        search: {
          placeholder: "Tìm kiếm",
        },
      },
      nav: {
        brand: "HAPPY PET CARE",
        auth: {
          signup: "Đăng ký",
          login: "Đăng nhập",
        },
        toggle: {
          show: "Hiện danh mục",
          hide: "Ẩn danh mục",
        },
        links: {
          home: "Trang chủ",
          services: {
            title: "Dịch vụ",
            items: {
              service1: "Dịch vụ 1",
              service2: "Dịch vụ 2",
              service3: "Dịch vụ 3",
            },
          },
          about: {
            title: "Về chúng tôi",
            why: "Vì sao HPC",
            gallery: "Bộ sưu tập",
          },
          contact: "Liên hệ",
        },
      },
      home: {
        hero: {
          title:
            'NHỮNG GÌ <span class="text-darkYellow">TỐT NHẤT</span> CHO THÚ CƯNG CỦA BẠN',
          subtitle:
            'Chăm sóc thú cưng chuyên nghiệp tại <span class="text-darkYellow">Allston, Brighton, Brookline, Chestnut Hill, Fenway, Kenmore, Newton Corner, MA</span>',
        },
        services: {
          heading:
            'Các <span class="text-[30px] text-[#6F32BE]">dịch vụ</span> nổi bật',
          learnMore: "Tìm hiểu thêm →",
          items: {
            dogWalking: {
              title: "Dắt chó đi dạo",
              description:
                "Lịch ghé 30, 45 hoặc 60 phút để thú cưng được vận động và vui chơi mỗi ngày.",
            },
            dogRunning: {
              title: "Chạy cùng chó",
              description:
                "Phù hợp với các bé năng động cần đốt năng lượng. Chọn buổi 25 hoặc 35 phút tùy nhu cầu.",
            },
            dogBoarding: {
              title: "Lưu trú thú cưng",
              description:
                "Chăm sóc toàn diện từ tắm táp, chải chuốt đến vui chơi giúp thú cưng có ngày tuyệt vời.",
            },
            dogOvernight: {
              title: "Trông qua đêm",
              description:
                "Bạn vắng nhà? Hãy để thú cưng ở lại với chúng tôi để được quan tâm và yêu thương suốt đêm.",
            },
            petInHome: {
              title: "Chăm sóc tại nhà",
              description:
                "Phục vụ cả chó và mèo. Chúng tôi cho ăn, thay nước, chơi và âu yếm ngay tại nhà bạn.",
            },
            petTaxi: {
              title: "Pet Taxi",
              description:
                "Đưa đón thú cưng đến spa, bác sĩ thú y hay công viên đúng giờ và an toàn.",
            },
          },
        },
        achievements: {
          heading:
            'Những <span class="text-[30px] text-[#6F32BE]">con số</span> nói lên tất cả',
          items: {
            experience: "Năm kinh nghiệm",
            happyClients: "Khách hàng & thú cưng hạnh phúc",
            professionals: "Chuyên viên tận tâm",
          },
        },
        reviews: {
          desktopHeading:
            'Chúng tôi đạt <span class="text-[30px] text-[#6F32BE]">4.9/5</span> trên',
          button: "Xem đánh giá →",
          mobileTitle: "Đánh giá trên",
          mobileButton: "Xem đánh giá",
          items: {
            khal:
              "Rất vui vì tìm được dịch vụ này! Họ chăm sóc thú cưng và cả cây cối cực kỳ chu đáo. Giá cả hợp lý cho sự tận tâm ấy.",
            thomas:
              "Happy Pet Care là lựa chọn duy nhất tôi tin tưởng giao chú mèo nhỏ. Hơn một năm gắn bó và chưa bao giờ thất vọng.",
            elizabeth:
              "Chó của tôi mê tít đội ngũ thân thiện ở đây. Chị chủ phản hồi nhanh và rất đáng tin cậy.",
            michael1:
              "Họ xem thú cưng như gia đình. Tôi luôn yên tâm mỗi khi gửi mèo cưng tại đây.",
            michael2:
              "Dịch vụ ổn định, giao tiếp rõ ràng, đội ngũ yêu nghề và rất tận tình.",
            michael3:
              "Rất đáng giới thiệu! Chuyên nghiệp, giàu kinh nghiệm và luôn để ý đến từng thói quen nhỏ.",
          },
        },
        gallery: {
          headingDesktop:
            'Ngắm nhìn những khoảnh khắc <span class="text-primary text-3xl font-bold">hạnh phúc</span>',
          headingMobile:
            'Những khoảnh khắc <span class="text-primary">hạnh phúc</span>',
          buttonDesktop: "Xem bộ sưu tập →",
          buttonMobile: "Xem bộ sưu tập",
          nextButton: "+",
        },
        footer: {
          title: "Mang niềm vui đến cho thú cưng",
          workingHoursTitle: "Giờ làm việc",
          workingHours: [
            "Thứ 2 - Chủ nhật: 10h - 21h",
            "Phục vụ cả ngày nghỉ & kỳ nghỉ lễ",
          ],
          locationTitle: "Địa chỉ",
          locationLine1: "Happy Pet Care 115 Sutherland",
          locationLine2: "Đường Brighton, MA",
          contactTitle: "Liên hệ",
          contactPrompt: "Có thắc mắc? Gọi cho chúng tôi",
          phone: "617-600-351",
          followTitle: "Kết nối",
          brandTagline: "HAPPY PET CARE",
        },
      },
      gallery: {
        categories: {
          all: "Tất cả",
          dogWalking: "Dắt chó đi dạo",
          dogRunning: "Chạy cùng chó",
          dogDayCare: "Giữ chó ban ngày",
          dogOvernight: "Trông qua đêm",
          petInHome: "Chăm sóc tại nhà",
          petTaxi: "Pet Taxi",
        },
        page: {
          heroTitle: "NHỮNG KHOẢNH KHẮC HẠNH PHÚC",
          heroSubtitle: "Chúng tôi đem niềm vui và yêu thương đến cho thú cưng",
          footerTitle: "Mang niềm vui đến cho thú cưng",
          heading:
            'Thú cưng cũng là <span class="text-[#6F32BE]">gia đình</span>',
          loadMore: "Xem thêm",
          showLess: "Thu gọn",
        },
      },
      requestServices: {
        title: "Đăng ký dịch vụ",
        subtitle:
          "Hãy chọn những dịch vụ bạn quan tâm và gửi yêu cầu cho chúng tôi",
        searchPlaceholder: "Tìm kiếm dịch vụ",
        status: {
          available: "(đang phục vụ) ✅",
          unavailable: "(tạm ngưng) ❌",
        },
        labels: {
          selectServices: "Chọn dịch vụ",
          perPet: "Mỗi thú cưng",
          bookNow: "Đặt ngay",
          reviews: "đánh giá",
        },
        cards: {
          "dog-walking": {
            title: "Dắt chó đi dạo",
            type: "Dịch vụ",
            description:
              "Lịch ghé 30, 45 hoặc 60 phút giúp thú cưng vận động và nạp năng lượng mỗi ngày.",
          },
          "dog-running": {
            title: "Chạy cùng chó",
            type: "Dịch vụ",
            description:
              "Dành cho các bé năng động cần chạy nhiều hơn. Chọn buổi 25 hoặc 35 phút theo thể lực.",
          },
          "dog-boarding": {
            title: "Lưu trú qua đêm",
            type: "Dịch vụ",
            description:
              "Ngày nghỉ tuyệt vời với chăm sóc trọn gói: tắm táp, chơi đùa, ăn uống chuẩn chỉnh.",
          },
          "dog-overnight-care": {
            title: "Trông chó ban đêm",
            type: "Dịch vụ",
            description:
              "Bạn vắng nhà buổi tối? Hãy để các bé ngủ lại với chúng tôi để được ôm ấp và dắt đi dạo đều đặn.",
          },
          "pet-in-home-visit": {
            title: "Chăm sóc tại nhà",
            type: "Dịch vụ",
            description:
              "Phù hợp cả chó và mèo. Chúng tôi cho ăn, thay nước, chơi đùa và vuốt ve ngay tại nhà bạn.",
          },
          "pet-taxi": {
            title: "Pet Taxi",
            type: "Dịch vụ",
            description:
              "Đưa đón thú cưng đi spa, bác sĩ hay công viên đúng giờ, an toàn và nhẹ nhàng.",
          },
        },
      },
      auth: {
        labels: {
          showPassword: "Hiện mật khẩu",
          forgotPassword: "Quên mật khẩu?",
        },
        google: {
          success: "Đăng nhập Google thành công!",
          error: "Đăng nhập Google thất bại. Vui lòng thử lại.",
        },
        github: {
          button: "Tiếp tục với GitHub",
          missingClientId:
            "Thiếu GitHub Client ID. Vui lòng liên hệ bộ phận hỗ trợ.",
          invalidCode: "GitHub trả về mã không hợp lệ. Vui lòng thử lại.",
          invalidState: "Xác thực GitHub không hợp lệ. Vui lòng thử lại.",
          success: "Đăng nhập GitHub thành công!",
          failure: "Đăng nhập GitHub thất bại. Vui lòng thử lại.",
          waitingTitle: "Đang xác thực với GitHub...",
          waitingSubtitle: "Vui lòng đợi trong giây lát.",
        },
        forgotPassword: {
          missingEmail: "Vui lòng điền email để lấy lại mật khẩu!",
        },
        login: {
          divider: "HOẶC",
          toggleHaveAccount: "Đã có tài khoản?",
          toggleNoAccount: "Chưa có tài khoản?",
          signIn: "Đăng nhập",
          register: "Đăng ký",
        },
      },
    },
  },
};

const storedLanguage =
  typeof window !== "undefined"
    ? localStorage.getItem("app_language") || "vi"
    : "vi";

i18n.use(initReactI18next).init({
  resources,
  lng: storedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
