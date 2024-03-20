import { uploadImagesDragAndDrop , createDoctorsHandle, validationObserver} from "./doctors"


//constants
const doctorsForm = document.getElementById("doctorsForm");


//handle create doctors
const createHandle = () => {


    //handle tinyCce
    tinymce.init({
        selector: 'textarea#default-editor'
    });

    validationObserver();
    uploadImagesDragAndDrop();
    createDoctors();
}



//handle create Doctors
const createDoctors = () => {

    document.getElementById("submitDoctors").addEventListener("click" , (event) => {


        event.preventDefault();
    
        createDoctorsHandle(doctorsForm).then((result) => {


            if(result.done == true)
            {


                doctorsForm.reset();


                location.assign("/Adminpanel/Dashboard/Home.html");

                //check translation 
                if(localStorage.getItem("Translate"))
                {
                    const language = localStorage.getItem("Translate");
                    
                    document.getElementById("submitDoctors").innerHTML = (language == "en")
                        ? "Create" 
                        : "انشئ";

                }
                else
                {

                    //change mode for submit btn for server loading
                    document.getElementById("submitDoctors").innerHTML = 
                    `
                        Create
                    `

                }

            }

        })
        .catch((result) => {

            document.querySelector(".errorList").textContent = result.messageError
            
            //change status of submit button and disabled it then show loading server

            document.getElementById("submitDoctors").classList.remove("disabled");

            //check translation 
            if(localStorage.getItem("Translate"))
            {
                const language = localStorage.getItem("Translate");
                
                document.getElementById("submitDoctors").innerHTML = (language == "en")
                    ? "Create" 
                    : "انشئ";

            }
            else
            {

                //change mode for submit btn for server loading
                document.getElementById("submitDoctors").innerHTML = 
                `
                    Create
                `

            }

        })
    
    });
    

}


createHandle();