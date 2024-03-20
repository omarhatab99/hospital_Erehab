//imports
import { createUserHandle, deleteUserHandle, getAllUser, getAllUserOnlyTime, getUserByAccessToken, getUserById, userValidation } from "../../Users/assets/js/users";
import { getFormData } from "../../Shared/Extension";
import Swal from 'sweetalert2';
import { getAllMessages, getMessageById } from "../../Messages/assets/js/messages";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteDoctorHandle, getAllDoctors } from "../../Doctors/assets/js/doctors";
import { clinicValidation, createClinicHandle, deleteClinicHandle, getAllClinic, getClinicById, updateClinicHandle } from "../../Clinics/assets/js/clinics";
import { firestore } from "../../../main";


//constants
const userModal = new bootstrap.Modal(document.getElementById('userModal'));
const clinicModal = new bootstrap.Modal(document.getElementById('clinicModal'));
const userModalForm = document.getElementById("userModalForm");
const clinicModalForm = document.getElementById("clinicModalForm");


  
let updated = false;

//handle dashboard
const dashboardHandle = () => {


    //Users
    getAllUser();
    showUserModal();
    createUser();
    deleteUser();

    //doctors
    getAllDoctors();
    deleteDoctor();
    //clinic
    getAllClinic();
    showClinicModal();
    saveClinic();
    deleteClinic();
    showClinicBox();
    //messages
    getAllMessages();
    showMessage();
};


//show modal handle 
const showUserModal = () => {

    document.body.addEventListener("click" , async(event) => {


        if(event.target.classList.contains("js-create-user-btn"))
        {
            event.preventDefault();
    
            userModalForm.reset();

            document.getElementById("userSpanError").textContent = "";

            userModal.show();
    
        }

    })


}




const createUser = () => {

    document.getElementById("submitUserBtn").addEventListener("click" , async(event) => {

        event.preventDefault();

        //get data from form
        const currentObject = getFormData(userModalForm);

        const user = new Object();

        user.username = currentObject.email.split("@")[0];
        user.email = currentObject.email;
        user.password = currentObject.password;
        user.role = currentObject.role;
        user.createAt = `${new Date()}`;
        user.lastUpdatedAt = "";
        user.profileImage = {imageUrl: "" , fullPath:""};
        user.status = true;


        //validation
        const validationResult = userValidation(user , "CREATE")
        if(validationResult.isValid)
        {   
            const users = await getAllUserOnlyTime();
            const isExisted = users.some((usr) => {return usr.email.toLowerCase() === user.email.toLowerCase()});

            if(!isExisted)
            {
                //check translation 
                if(localStorage.getItem("Translate"))
                {
                    const language = localStorage.getItem("Translate");

                    //change mode for submit btn for server loading
                    document.getElementById("submitUserBtn").innerHTML = (language == "en")
                        ? `
                            <div class="spinner-border text-secondary me-1" role="status">
                                <span class="visually-hidden">Loading...</span> 
                            </div>
                            Loading...
                        ` 
                        : `
                            تحميل ...
                            <div class="spinner-border text-secondary me-1" role="status">
                                <span class="visually-hidden">Loading...</span> 
                            </div>
                            
                        
                        `;

                }
                else
                {

                    //change mode for submit btn for server loading
                    document.getElementById("submitUserBtn").innerHTML = 
                    `
                        <div class="spinner-border text-secondary me-1" role="status">
                            <span class="visually-hidden">Loading...</span> 
                        </div>
                        Loading...
                    `


                }

                document.getElementById("userSpanError").textContent = "";

                createUserHandle(user).then((data) => {

                    if(data.done)
                    {
                        //check translation 
                        if(localStorage.getItem("Translate"))
                        {
                            const language = localStorage.getItem("Translate");
                            
                            document.getElementById("submitUserBtn").innerHTML = (language == "en")
                            ? "Create" 
                            : "انشاء";

                        }
                        else
                        {

                            //change mode for submit btn for server loading
                            document.getElementById("submitUserBtn").innerHTML = 
                            `
                                Create
                            `

                        }

                        //close modal
                        userModal.hide();

                        //resit form
                        userModalForm.reset();


                    }

                })
                .catch((data) => {
                    console.log(data.messageError);
                    if(data.messageError.toString().includes("Firebase: Error (auth/email-already-in-use)."))
                        data.messageError = "This email is already existed..!!";
                    
                    document.getElementById("userSpanError").textContent = data.messageError;

                    //check translation 
                    if(localStorage.getItem("Translate"))
                    {
                        const language = localStorage.getItem("Translate");
                        
                        document.getElementById("submitUserBtn").innerHTML = (language == "en")
                        ? "Create" 
                        : "انشاء";

                    }
                    else
                    {

                        //change mode for submit btn for server loading
                        document.getElementById("submitUserBtn").innerHTML = 
                        `
                            Create
                        `

                    }
                })
            }
            else
            {
                document.getElementById("userSpanError").textContent = "This email is already existed..!!";
            }

        }
        else
        {
            document.getElementById("userSpanError").textContent = validationResult.messageError;
        }



    });

}

//delete user handle 
const deleteUser = () => {
    document.addEventListener("click" , async(event) => {
        if(event.target.classList.contains("js-delete-user-btn"))
        {
            const userid = event.target.dataset.id;
            const user = await getUserById(userid);

            const accessToken = localStorage.getItem("Hospital_AccessToken");
            const accountLogin = await getUserByAccessToken(accessToken);

            if(user.role.toString().toLowerCase() === "admin" && user.email === "adminHospital@gmail.com")
            {
                Swal.fire({
                    icon: "error",
                    title: localStorage.getItem("Translate") == "ar" ? "غير مسموح" : "Prevented..!!",
                    text: localStorage.getItem("Translate") == "ar" ? "لايمكن حذف مستخدم من نوع ادمن !!" : "This user can't deleted due to is admin!!",
                    confirmButtonText: localStorage.getItem("Translate") == "ar" ? "تمام" : "OK"
                  });
            }
            else if(userid === accountLogin.id) //user is login now
            {
                Swal.fire({
                    icon: "error",
                    title: localStorage.getItem("Translate") == "ar" ? "غير مسموح" : "Prevented..!!",
                    text: localStorage.getItem("Translate") == "ar" ? "لايمكن حذف مستخدم من نوع ادمن !!" : "This user can't deleted due to is admin!!",
                    confirmButtonText: localStorage.getItem("Translate") == "ar" ? "تمام" : "OK"
                  });
            }
            else
            {
                Swal.fire({ 
                    title: localStorage.getItem("Translate") == "ar" ? "  انت متاكد من حذف هذا المستخدم ؟" : "sure you want delete this user?",
                    text: localStorage.getItem("Translate") == "ar" ? "!! لن تكون قادر على استعادته" : "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText:localStorage.getItem("Translate") == "ar" ? "نعم احذفه" : "Yes, delete it!",
                    cancelButtonText: localStorage.getItem("Translate") == "ar" ? "تجاهل" : "Cancel"
                  }).then(async (result) => {
                    if (result.isConfirmed) {
    
    
                        //delete user here
    
                        await deleteUserHandle(userid);
    

                      Swal.fire({
                        position: "center-center",
                        icon: "success",
                        title: localStorage.getItem("Translate") == "ar" ? "تم حذف المستخدم بنجاح" : "User has been deleted successfully.",
                        showConfirmButton: false,
                        timer: 1500
                      });
                    }
                  });
            }
            
        }
    })
}


//delete user handle 
const deleteDoctor = () => {
    document.addEventListener("click" , async(event) => {
        if(event.target.classList.contains("js-delete-doctor-btn"))
        {
            const doctorid = event.target.dataset.id;

            Swal.fire({ 
                title: localStorage.getItem("Translate") == "ar" ? "  انت متاكد من حذف هذا الدكتور ؟" : "sure you want delete this doctor?",
                text: localStorage.getItem("Translate") == "ar" ? "!! لن تكون قادر على استعادته" : "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText:localStorage.getItem("Translate") == "ar" ? "نعم احذفه" : "Yes, delete it!",
                cancelButtonText: localStorage.getItem("Translate") == "ar" ? "تجاهل" : "Cancel"
                }).then(async (result) => {
                if (result.isConfirmed) {


                    //delete doctor here

                    await deleteDoctorHandle(doctorid);


                    Swal.fire({
                    position: "center-center",
                    icon: "success",
                    title: localStorage.getItem("Translate") == "ar" ? "تم حذف الدكتور بنجاح" : "Doctor has been deleted successfully.",
                    showConfirmButton: false,
                    timer: 1500
                    });
                }
                });
            
        
        }
    })
}


//show message handle
const showMessage = () => {
    document.addEventListener("click" , async(event) => {

        if(event.target.classList.contains("js-watch-message"))
        {
            const messageid = event.target.dataset.id;
            const documentationReference = doc(firestore , "Messages" , messageid);
            //update message to be watched
            const message = await getMessageById(messageid);
            message.isWatched = true;
            message.lastUpdatedAt = `${new Date()}`;
            //update message 
            updateDoc(documentationReference , message).then(() => {
                window.location.assign(`/Adminpanel/Messages/Details.html?id=${message.id}`);
            })
            .catch((data) => {console.log(data)});

        }

        if(event.target.classList.contains("js-delete-message"))
        {
            const messageid = event.target.dataset.id;
            const documentationReference = doc(firestore , "Messages" , messageid);

            //delete message

            Swal.fire({ 
                title: localStorage.getItem("Translate") == "ar" ? "  انت متاكد من حذف هذه الرساله ؟" : "sure you want delete this message?",
                text: localStorage.getItem("Translate") == "ar" ? "!! لن تكون قادر على استعادته" : "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText:localStorage.getItem("Translate") == "ar" ? "نعم احذفه" : "Yes, delete it!",
                cancelButtonText: localStorage.getItem("Translate") == "ar" ? "تجاهل" : "Cancel"
              }).then(async (result) => {
                if (result.isConfirmed) {


                    //delete message here

                    await deleteDoc(documentationReference);


                  Swal.fire({
                    position: "center-center",
                    icon: "success",
                    title: localStorage.getItem("Translate") == "ar" ? "تم حذف الرساله بنجاح" : "Your message has been deleted successfully.",
                    showConfirmButton: false,
                    timer: 1500
                  });
                }
              });

        }


    });
}


//show modal handle 
const showClinicModal = () => {

    document.body.addEventListener("click" , async(event) => {


        if(event.target.classList.contains("js-create-clinic-btn"))
        {
            event.preventDefault();
            
            updated = false;

            clinicModalForm.reset();

            document.getElementById("clinicSpanError").textContent = "";

            if(localStorage.getItem("Translate") == "en")
            {
                document.querySelector(".user-modal-title").textContent = "Create New Clinic";
            }
            else
            {
                document.querySelector(".user-modal-title").textContent = "اضافه عيادة جديدة";
            }

            document.getElementById("submitClinicBtn").classList.replace("btn-warning" , "btn-primary");
            document.querySelector(".clinic-image-preview").src = "/images/clinic-placeholder.webp";

            clinicModal.show();
    
        }

        if(event.target.classList.contains("js-update-clinic-btn"))
        {
            event.preventDefault();

            updated = true;

            const clinicid = event.target.dataset.id; 
    
            clinicModalForm.reset();

            document.getElementById("clinicSpanError").textContent = "";


            //Get Clinic by id
            const clinic = await getClinicById(clinicid)

            if(localStorage.getItem("Translate") == "en")
            {
                document.querySelector(".user-modal-title").textContent = `Edit ${clinic.name} Clinic`;
                document.getElementById("submitClinicBtn").textContent = "Edit";
            }
            else
            {
                document.querySelector(".user-modal-title").textContent = "تعديل بيانات العيادة";
                document.getElementById("submitClinicBtn").textContent = "تعديل";
            }

            document.getElementById("submitClinicBtn").classList.replace("btn-primary" , "btn-warning");
            
            document.getElementById("clinicId").value = clinicid;
            document.getElementById("clinicName").value = clinic.name;
            document.querySelector(".clinic-image-preview").src = clinic.clinicImage.imageUrl;
            



            clinicModal.show();
    
        }
    })


}


const saveClinic = () => {

    document.getElementById("submitClinicBtn").addEventListener("click" , async(event) => {

        event.preventDefault();

        //get data from form
        const currentObject = getFormData(clinicModalForm);
        //check updated
        if(updated) { //updated

            //validation
            const validationResult = clinicValidation(currentObject , "UPDATE")

            if(validationResult.isValid)
            {
                //check translation 
                if(localStorage.getItem("Translate"))
                {
                    const language = localStorage.getItem("Translate");

                    //change mode for submit btn for server loading
                    document.getElementById("submitClinicBtn").innerHTML = (language == "en")
                        ? `
                            <div class="spinner-border text-secondary me-1" role="status">
                                <span class="visually-hidden">Loading...</span> 
                            </div>
                            Loading...
                        ` 
                        : `
                            تحميل ...
                            <div class="spinner-border text-secondary me-1" role="status">
                                <span class="visually-hidden">Loading...</span> 
                            </div>
                            
                        
                        `;

                }
                else
                {

                    //change mode for submit btn for server loading
                    document.getElementById("submitClinicBtn").innerHTML = 
                    `
                        <div class="spinner-border text-secondary me-1" role="status">
                            <span class="visually-hidden">Loading...</span> 
                        </div>
                        Loading...
                    `


                }

                updateClinicHandle(currentObject , currentObject.id).then((data) => {
                    if(data.done)
                    {
                        //check translation 
                        if(localStorage.getItem("Translate"))
                        {
                            const language = localStorage.getItem("Translate");
                            
                            document.getElementById("submitClinicBtn").innerHTML = (language == "en")
                            ? "Create" 
                            : "انشاء";

                        }
                        else
                        {

                            //change mode for submit btn for server loading
                            document.getElementById("submitClinicBtn").innerHTML = 
                            `
                                Create
                            `

                        }

                        //close modal
                        clinicModal.hide();

                        //resit form
                        clinicModalForm.reset();

                        updated = false;
                    }
                })
                .catch((data) => {
                    console.log(data.messageError);                    
                    document.getElementById("clinicSpanError").textContent = data.messageError;

                    //check translation 
                    if(localStorage.getItem("Translate"))
                    {
                        const language = localStorage.getItem("Translate");
                        
                        document.getElementById("submitClinicBtn").innerHTML = (language == "en")
                        ? "Create" 
                        : "انشاء";

                    }
                    else
                    {

                        //change mode for submit btn for server loading
                        document.getElementById("submitClinicBtn").innerHTML = 
                        `
                            Create
                        `

                    }
                });
            }
            else
            {
                document.getElementById("clinicSpanError").textContent = validationResult.messageError;
            }

        }
        else //create
        {

            const clinic = new Object();

            clinic.name = currentObject.name
            clinic.clinicImage = currentObject.clinicImage;
            clinic.createAt = `${new Date()}`;
            clinic.lastUpdatedAt = "";
            clinic.status = true;

            const validationResult = clinicValidation(clinic , "CREATE")
            if(validationResult.isValid)
            {   

                //check translation 
                if(localStorage.getItem("Translate"))
                {
                    const language = localStorage.getItem("Translate");

                    //change mode for submit btn for server loading
                    document.getElementById("submitClinicBtn").innerHTML = (language == "en")
                        ? `
                            <div class="spinner-border text-secondary me-1" role="status">
                                <span class="visually-hidden">Loading...</span> 
                            </div>
                            Loading...
                        ` 
                        : `
                            تحميل ...
                            <div class="spinner-border text-secondary me-1" role="status">
                                <span class="visually-hidden">Loading...</span> 
                            </div>
                            
                        
                        `;

                }
                else
                {

                    //change mode for submit btn for server loading
                    document.getElementById("submitClinicBtn").innerHTML = 
                    `
                        <div class="spinner-border text-secondary me-1" role="status">
                            <span class="visually-hidden">Loading...</span> 
                        </div>
                        Loading...
                    `


                }

                createClinicHandle(clinic).then((data) => {
                    if(data.done)
                    {
                        //check translation 
                        if(localStorage.getItem("Translate"))
                        {
                            const language = localStorage.getItem("Translate");
                            
                            document.getElementById("submitClinicBtn").innerHTML = (language == "en")
                            ? "Create" 
                            : "انشاء";

                        }
                        else
                        {

                            //change mode for submit btn for server loading
                            document.getElementById("submitClinicBtn").innerHTML = 
                            `
                                Create
                            `

                        }

                        //close modal
                        clinicModal.hide();

                        //resit form
                        clinicModalForm.reset();
                    }
                }).catch((data) => {
                    console.log(data.messageError);                    
                    document.getElementById("clinicSpanError").textContent = data.messageError;

                    //check translation 
                    if(localStorage.getItem("Translate"))
                    {
                        const language = localStorage.getItem("Translate");
                        
                        document.getElementById("submitClinicBtn").innerHTML = (language == "en")
                        ? "Create" 
                        : "انشاء";

                    }
                    else
                    {

                        //change mode for submit btn for server loading
                        document.getElementById("submitClinicBtn").innerHTML = 
                        `
                            Create
                        `

                    }
                });

    
            }
            else
            {
                document.getElementById("clinicSpanError").textContent = validationResult.messageError;
            }



        }


    });

}

//delete user handle 
const deleteClinic = () => {
    document.addEventListener("click" , async(event) => {
        if(event.target.classList.contains("js-delete-clinic-btn"))
        {
            const clinicid = event.target.dataset.id;
            const clinic = await getClinicById(clinicid);


            Swal.fire({ 
                title: localStorage.getItem("Translate") == "ar" ? "  انت متاكد من حذف هذا العيادة ؟" : "sure you want delete this clinic?",
                text: localStorage.getItem("Translate") == "ar" ? "!! لن تكون قادر على استعادته" : "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText:localStorage.getItem("Translate") == "ar" ? "نعم احذفه" : "Yes, delete it!",
                cancelButtonText: localStorage.getItem("Translate") == "ar" ? "تجاهل" : "Cancel"
              }).then(async (result) => {
                if (result.isConfirmed) {


                    //delete user here

                    await deleteClinicHandle(clinicid);


                  Swal.fire({
                    position: "center-center",
                    icon: "success",
                    title: localStorage.getItem("Translate") == "ar" ? "تم حذف العيادة بنجاح" : "clinic has been deleted successfully.",
                    showConfirmButton: false,
                    timer: 1500
                  });
                }
              });
            
        }
    })
}

//show clinc box
const showClinicBox = () => {

    document.addEventListener("click" , (event) => {
        if(event.target.classList.contains("show-image-clinic")){
            document.querySelector(".lightBox-overlay").style.opacity = 1;
            document.querySelector(".lightBox-overlay").style.zIndex = 1000;
            document.querySelector(".image-center-container img").src = event.target.dataset.src
        }
    });

    document.querySelector(".lightBox-overlay").addEventListener("click" , () => {

        document.querySelector(".lightBox-overlay").style.opacity = "0";
        document.querySelector(".lightBox-overlay").style.zIndex = "-1000";
    
    });
    
}







dashboardHandle();