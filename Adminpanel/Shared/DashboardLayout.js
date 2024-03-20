
//imports
import { doc, onSnapshot} from "firebase/firestore";
import { authenticationLogout } from "../Authentication/assets/js/authentication";
import { getAllUserOnlyTime } from "../Users/assets/js/users";
import { firestore } from "../../main";
//constants



//handle dashboard layout for all dashboard pages
const dashboardLayout = async() => {
    //current users
    const users = await getAllUserOnlyTime();

    //check if account is already login by access token
    const accessTokenStoredAtLocalStorage = localStorage.getItem("Hospital_AccessToken");

    const accountLogin = users.find((element) => {return element.accessToken == accessTokenStoredAtLocalStorage});
    
    //check user login authentication
    if(users.length > 0){
        //check if access token is already stored in database
        if(accountLogin)
        {
            logout(accountLogin.id);
        }
        else
        {
            //user is not login.
            window.location.assign("/Adminpanel/Authentication/Login.html");
        }

    }
    else
    {
        //user is not login.
        window.location.assign("/Adminpanel/Authentication/Login.html");
    }

    const documentationReference = doc(firestore , "Users" , accountLogin.id);

    onSnapshot(documentationReference , (snapshot) => { //get user by id and observe it

        //get account login
        const accountLogin = {id:snapshot.id , ...snapshot.data()};

        //check user authorization (Permissions)
        userPermissions(accountLogin);

        //generate header
        document.getElementById("header").innerHTML = 
        `
            <nav class="navbar">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">
                        <img src="/images/project_logo.png" alt="logo">
                    </a>
                    <div class="profile">

                        <div class="dark-mode d-none d-sm-flex">
                            <span data-mode="light" class="material-icons-sharp active">
                                light_mode
                            </span>
                            <span data-mode="dark" class="material-icons-sharp">
                                dark_mode
                            </span>
                        </div>
                        <div class="dropdown">
                            <div class="profile-info" data-bs-toggle="dropdown" aria-expanded="false">
                                <div class="info">
                                    <p><small data-i18n="hey">Hey</small>, <b>${accountLogin.username}</b></p>
                                    <small>${accountLogin.role.toLowerCase()}</small>
                                </div>
                                <div class="profile-photo">
                                    <img class="img-thumbnail border-img" src=${accountLogin.profileImage.imageUrl ? accountLogin.profileImage.imageUrl : "/images/avatar.jpg"}>
                                </div>
                            </div>
                            <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/Adminpanel/Users/Profile.html?id=${accountLogin.id}" data-i18n="cnprofile">Profile</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item js-logout-btn" href="javascript:;" data-i18n="logout">Logout</a></li>
                            </ul>
                        </div>

                    </div>
                </div>
            </nav>
    
        `;

        //handle select langauge 
        document.getElementById("langContainer").innerHTML = 
        `

            <div class="btn-group dropup langauge-select">
                <button style="direction:ltr" class="btn btn-light btn-sm dropdown-toggle select-langauge-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img class="me-2" src="/images/english-icon-usa.png" alt="english" width="15px">
                    English
                </button>
                <ul class="dropdown-menu">
                    <li>
                        <a style="direction:ltr" class="dropdown-item lang-en" href="javascript:;">
                            <img class="lang-en-flag me-2" src="/images/english-icon-usa.png" alt="english" width="15px">
                            <span class="lang-en-span" data-i18n="english">English</span>
                        </a>
                    </li>
                    <li>
                        <a style="direction:ltr" class="dropdown-item lang-ar" href="javascript:;">
                            <img class="lang-ar-flag me-2" src="/images/arabic-icon-egypt.png" alt="english" width="15px">
                            <span  class="lang-ar-span" data-i18n="arabic">Arabic</span>
                        </a>
                    </li>
                </ul>
            </div>

    
        `;
        
        //check translation 
        if(localStorage.getItem("Translate"))
        {
            const language = localStorage.getItem("Translate");
        
            if(language == "en")
            {
                document.querySelector(".lang-en-span").click();
            }
            else
            {
                document.querySelector(".lang-ar-span").click();

            }

        }
        else
        {
            localStorage.setItem("Translate" , "en");
            document.querySelector(".doc-dropdown").innerHTML = 
            `
                Actions
            `
        }

        //check dark mode
        if(localStorage.getItem("mode")) {
            if(localStorage.getItem("mode") === "dark")
            {
                const darkMode = document.querySelectorAll(".dark-mode span");
                document.body.classList.add("dark-mode-variables")
                darkMode.forEach((btn) => btn.classList.remove("active"));
                darkMode[1].classList.add("active");
            
            }
        }

        //hide loading
        document.querySelector(".overlay-loading").style.display = "none";

        darkModeHandle();//handle dark mode


    });


}

//handle user permissions
const userPermissions = (currentUser) => {
    //check if user not super admin and not admin
    if(currentUser.role.toLowerCase() !== "admin")
    {
        if(document.getElementById("asideUser"))
        {
            document.getElementById("asideUser").remove();
        }

        if(document.getElementById("users"))
        {
            document.getElementById("users").remove();
        }
    }


    //check if user is archieve
    if(currentUser.role.toLowerCase() === "archieve")
    {
        if(document.getElementById("asideMessages"))
        {
            document.getElementById("asideMessages").remove();
        }

        
        if(document.getElementById("messages"))
        {
            document.getElementById("messages").remove();
        }
    }

    
    //check if user is reception
    if(currentUser.role.toLowerCase() === "reception")
    {
        if(document.getElementById("asideDoctors"))
        {
            document.getElementById("asideDoctors").remove();
        }

        if(document.getElementById("doctors"))
        {
            document.getElementById("doctors").remove();
        }

        if(document.getElementById("asideClinics"))
        {
            document.getElementById("asideClinics").remove();
        }

        if(document.getElementById("clinics"))
        {
            document.getElementById("clinics").remove();
        }
    }
}

//handle dark model 
const darkModeHandle = () => {
    const darkMode = document.querySelectorAll(".dark-mode span");

    //check dark mode
    if(localStorage.getItem("mode")) {
        if(localStorage.getItem("mode") === "dark")
        {
            document.body.classList.add("dark-mode-variables")
            darkMode.forEach((btn) => btn.classList.remove("active"));
            darkMode[1].classList.add("active");
            
        }
    }
    
    
    //change mode color 
    darkMode.forEach((btn) => {
        btn.addEventListener("click" , function(){
            darkMode.forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");
    
            if(this.dataset.mode === "light") {
                document.body.classList.remove("dark-mode-variables");
                document.querySelector(".profile ul.dropdown-menu").classList.remove("dropdown-menu-dark");
                localStorage.setItem("mode" , "light");
            }
            else {
                document.body.classList.add("dark-mode-variables");
                document.querySelector(".profile ul.dropdown-menu").classList.add("dropdown-menu-dark");
                localStorage.setItem("mode" , "dark");
            } 
        });
    })
}

const logout = (userid) => {
    document.addEventListener("click" , (event) => {

        if(event.target.classList.contains("js-logout-btn"))
        {
            authenticationLogout(userid);
        }

    });
}


dashboardLayout();


