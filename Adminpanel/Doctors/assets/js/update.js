import { getSingleDoctorById, updateDoctorsHandle, uploadImagesDragAndDrop, validationObserver } from "./doctors";

//constants
const params = new URLSearchParams(location.search);
const id = params.get('id');

const doctorsForm = document.getElementById("doctorsForm");


//handle doctor update
const updateHandle = () => {
    //handle tinyCce
    tinymce.init({
        selector: 'textarea#default-editor',
    });

    uploadImagesDragAndDrop();
    prepareProductUpdateForm();
    validationObserver();
    updateDoctors();
}




//prepare form form upload
const prepareProductUpdateForm = async() => {
    const currentObject = await getSingleDoctorById(id);

    doctorsForm.name.value = currentObject.name;
    doctorsForm.specialization.value = currentObject.specialization;
    tinyMCE.activeEditor.setContent(currentObject.description);
    
    
    document.getElementById("previewImg").src = (currentObject.profileImage.imageUrl) ?currentObject.profileImage.imageUrl : "assets/images/avatar-placeholder.png";

}



const updateDoctors = () => {

    document.getElementById("submitDoctors").addEventListener("click" , (event) => {


        event.preventDefault();
    
        updateDoctorsHandle(doctorsForm , id).then((result) => {


            if(result.done == true)
            {


                doctorsForm.reset();


                location.assign("/Adminpanel/Dashboard/Home.html");

                //check translation 
                if(localStorage.getItem("Translate"))
                {
                    const language = localStorage.getItem("Translate");
                    
                    document.getElementById("submitDoctors").innerHTML = (language == "en")
                        ? "Edit" 
                        : "انشئ";

                }
                else
                {

                    //change mode for submit btn for server loading
                    document.getElementById("submitDoctors").innerHTML = 
                    `
                        Edit
                    `

                }


            }

        })
        .catch((result) => {
            console.log(result.messageError);
            document.querySelector(".errorList").textContent = result.messageError
            
            //change status of submit button and disabled it then show loading server

            document.getElementById("submitDoctors").classList.remove("disabled");

            //check translation 
            if(localStorage.getItem("Translate"))
            {
                const language = localStorage.getItem("Translate");
                
                document.getElementById("submitDoctors").innerHTML = (language == "en")
                    ? "Edit" 
                    : "انشئ";

            }
            else
            {

                //change mode for submit btn for server loading
                document.getElementById("submitDoctors").innerHTML = 
                `
                    Edit
                `

            }

        })
    
    });
    
}









updateHandle();