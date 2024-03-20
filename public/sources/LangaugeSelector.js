
//constants
const asideItems = document.querySelectorAll(".container-fluid aside .toggle .sidebar a span:first-of-type");
const centerDashed = document.querySelectorAll(".centerDash");
//handle langauge selector
const languageSelector = () => {

    dropdownSelector();

    document.addEventListener("click" , (event) => {
        if(event.target.classList.contains("doc-dropdown"))
        {
            if(localStorage.getItem("Translate") == "en")
            {
                document.querySelector(".js-details-doctor-btn").innerHTML = `<i class="fa-regular fa-eye me-2"></i> Details`;
                document.querySelector(".js-update-doctor-btn").innerHTML = `<i class="fa-solid fa-pencil  me-2"></i> Update`;
                document.querySelector(".js-delete-doctor-btn").innerHTML = `<i class="fa-solid fa-trash-can me-2"></i> Delete`;
            }
            else
            {
                document.querySelector(".js-details-doctor-btn").innerHTML = `<i class="fa-regular fa-eye me-2"></i> تفاصيل`;
                document.querySelector(".js-update-doctor-btn").innerHTML = `<i class="fa-solid fa-pencil  me-2"></i> تعديل`;
                document.querySelector(".js-delete-doctor-btn").innerHTML = `<i class="fa-solid fa-trash-can me-2"></i> حذف`;

            }
        }
    })

};


//transalate lanuages
const transalations = {
    en: {
        dashboard: "Dashboard",
        users: "Users",
        doctors: "Doctors",
        messages: "Messages",
        mainHeading: "Admin Panel <span class='text-danger'>El-Rehab</span> Hospital",
        mainParagraph: "This page only accessed by 'Admin' , only has permissions",
        hey: "Hey",
        admin: "Admin",
        english: "English",
        arabic: "Arabic",
        cnprofile: "Profile",
        cnemail: "Change Email",
        cnpass: "Change Password",
        logout: "Logout",
        back: "Back to List",
        profileInformation: "Profile Information",
        applicationDeveloper: "Application Developer",
        admin: "admin",
        username: "Username:",
        email: "Email",
        phone: "Phone",
        createdAt: "Created",
        lastUpdated: "Last Updated",
        role: "Role",
        changeProfileSettings: "Change Profile Settings",
        emailAddress: "Email Address",
        phoneNumber: "Phone Number",
        chooseImage: "Choose Image",
        saveChanges: "Save Changes",
        create: "Create",
        users: "Users",
        close: "Close",
        createObject: "Create",
        action: "Action",
        messageDetails: "Message Details",
        message: "Message",
        messageFrom: "Message From",
        messages: "Messages",
        editdoctors: "Edit Doctors information",
        createdoctors: "Create Doctors",
        imageUploading: "image Uploading...",
        upload: "Upload",
        uploadingImageHere: "upload image here",
        browse: "Browse",
        name: "Name",
        specialization : "Specialization",
        add: "Create",
        update: "Edit",
        doctorDetails: "Doctor Information",
        createNewUser: "Create New User",
        clinic: "Clinics",
        clinicName: "Clinic Name",
        createNewClinic: "Create New Clinic"
    },

    ar: {
        dashboard: "الصفحه الرئيسيه",
        users: "المستخدمين",
        doctors: "الاطباء",
        messages: "الرسائل",
        mainHeading: "لوحه تحكم مستشفى <span class='text-danger'>الرحاب</span>",
        mainParagraph: "هذة الصفحه صالحه للوصول فقط للمستخم ادمن هو فقط من له الصلاحيات",
        hey: "اهلا",
        admin: "ادمن",
        english: "الانجليزيه",
        arabic: "العربيه",
        cnprofile: "البروفيل",
        cnemail: "تغيير البريد الالكترونى",
        cnpass: "تغيير الباسورد",
        logout: "تسجيل الخروج",
        back: "العودة ",
        profileInformation: "معلومات الحساب",
        applicationDeveloper: "مطور البرنامج",
        admin: "ادمن",
        username: "اسم المستخدم",
        email: "البريد الالكترونى",
        phone: "المحمول",
        createdAt: "انشئ فى",
        lastUpdated: "اخر تحديث فى",
        role: "الدور",
        changeProfileSettings: "تغيير اعدادات الحساب",
        emailAddress: "البريد الالكترونى",
        phoneNumber: "رقم المحمول",
        chooseImage: "اختر صورة",
        saveChanges: "حفظ التغيرات",
        create: "جديد",
        users: "المستخدمين",
        close: "تجاهل",
        createObject: "انشاء",
        action: "تحكم",
        messageDetails: "تفاصيل الرساله",
        message: "الرساله",
        messageFrom: "الرساله من",
        messages: "الرسائل",
        editdoctors: "تعديل معلومات الطبيب",
        createdoctors: "انشاء طبيب جديد",
        imageUploading: "رفع الصورة...",
        upload: "رفع",
        uploadingImageHere: "ارفع صورة من هنا",
        name: "الاسم",
        specialization : "التخصص",
        add: "انشئ",
        update: "تعديل",
        doctorDetails: "معلومات الطبيب",
        createNewUser: "انشئ مستخدم جديد",
        clinic: "العيادات",
        clinicName: "اسم العيادة",
        createNewClinic: "اضافه عيادة جديدة"


    }
}




//handle dropdown list selector
const dropdownSelector = () => {
    document.addEventListener("click" , (event) => {
        if(event.target.classList.contains("lang-en-span") || event.target.classList.contains("lang-en-flag") || event.target.classList.contains("lang-ar")) //if user select english language.
        {
            document.querySelector(".select-langauge-btn").innerHTML = document.querySelector(".lang-en").innerHTML;

            //translate operation

            //save at local storage
            localStorage.setItem("Translate" , "en");

            //change body language 
            document.body.style.fontFamily = "'Rajdhani', sans-serif";

            //change html direction
            document.documentElement.setAttribute("dir" , "ltr");

            asideItems.forEach((element) => {
                element.style.marginLeft = "1.5rem";
                element.style.marginRight = "0px";
            });

            //handle center dashed in item direction
            centerDashed.forEach((element) => {

                element.style.left = "0%";
                element.style.transform = "translate(0% , -50%)";

            });
            
            document.querySelector(".navbar-brand img").style.marginLeft = "0px";
            document.querySelector(".navbar-brand img").style.marginRight = "10px";

            document.querySelector(".navbar .profile .dark-mode").style.marginRight = "20px";
            document.querySelector(".navbar .profile .dark-mode").style.marginLeft = "0px";


            document.querySelectorAll(".profile .dropdown-menu .dropdown-item")
            .forEach((element) => {element.style.textAlign = "left"});

            if(document.querySelectorAll(".main-title-icon").length > 0)
            {
                document.querySelectorAll(".main-title-icon").forEach((element) => {
                    element.style.marginRight = "10px";
                    element.style.marginLeft = "0px";
                })
            }

            
            if(document.querySelector(".user-details-th")){
                document.querySelector(".user-details-th").style.textAlign = "left";
            }

            if(document.querySelectorAll(".js-delete-user-btn").length > 0){
                document.querySelectorAll(".js-delete-user-btn").forEach((element) => {
                    element.innerHTML = "Delete";
                })
            }

            if(document.querySelectorAll(".swal2-title").length > 0){
                document.querySelectorAll(".swal2-title").forEach((element) => {
                    element.innerHTML = "Are you sure you want delete this user?";
                })
            }

            if(document.querySelectorAll(".doc-dropdown").length > 0){
                document.querySelectorAll(".doc-dropdown").forEach((element) => {
                    element.innerHTML = "Actions";
                })
            }

            setLanguage("en");
        }


        if(event.target.classList.contains("lang-ar-span") || event.target.classList.contains("lang-ar-flag") || event.target.classList.contains("lang-ar")) //if user select arabic language.
        {
            document.querySelector(".select-langauge-btn").innerHTML = document.querySelector(".lang-ar").innerHTML;
            
            //translate operation

            //save at local storage
            localStorage.setItem("Translate" , "ar");

            //change body language 
            document.body.style.fontFamily = "'Cairo', sans-serif";

            //change html direction
            document.documentElement.setAttribute("dir" , "rtl");

            //handle item in aside margin to fix direction
            asideItems.forEach((element) => {
                element.style.marginLeft = "0px";
                element.style.marginRight = "1.5rem";
            })

            //handle center dashed in item direction
            centerDashed.forEach((element) => {

                element.style.left = "100%";
                element.style.transform = "translate(-100% , -50%)";

            });

            document.querySelector(".navbar-brand img").style.marginLeft = "10px";
            document.querySelector(".navbar-brand img").style.marginRight = "0px";

            document.querySelector(".navbar .profile .dark-mode").style.marginRight = "0px";
            document.querySelector(".navbar .profile .dark-mode").style.marginLeft = "20px";

            document.querySelector(".profile .dropdown-menu").style.left = "0px";
            document.querySelectorAll(".profile .dropdown-menu .dropdown-item")
            .forEach((element) => {element.style.textAlign = "right"});

            if(document.querySelectorAll(".main-title-icon").length > 0)
            {
                document.querySelectorAll(".main-title-icon").forEach((element) => {
                    element.style.marginRight = "0px";
                    element.style.marginLeft = "10px";
                })
            }

            if(document.querySelector(".user-details-th")){
                document.querySelector(".user-details-th").style.textAlign = "right";
            }

            if(document.querySelectorAll(".js-delete-user-btn").length > 0){
                document.querySelectorAll(".js-delete-user-btn").forEach((element) => {
                    element.innerHTML = "حذف";
                })
            }

            if(document.querySelectorAll(".doc-dropdown").length > 0){
                document.querySelectorAll(".doc-dropdown").forEach((element) => {
                    element.innerHTML = "العمليات";
                })
            }
            setLanguage("ar");
        }

    });
}




//handle method to set language
const setLanguage = (language) => {
    const elements = document.querySelectorAll("[data-i18n]");
    let transKey;

    elements.forEach((element) => {
        transKey = element.dataset.i18n;
        element.innerHTML = transalations[language][transKey];
    });

}





languageSelector();