//imports
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where} from "firebase/firestore";
import {Result, ValidationResult} from "../../../Shared/modules";
import {deleteImage, getFormData, uploadImage} from "../../../Shared/Extension";
import { firestore } from "../../../../main";

//constants

const collectionReference = collection(firestore , "Doctors");
const images = []; //store images after handling drag and drop method

//get all doctors to display it in datatable
export const getAllDoctors = () => {

    //get all user
    onSnapshot(collectionReference , (snapshot) => {


        const doctors = [];

        snapshot.docs.forEach((doc) => {

            doctors.push({id: doc.id , ...doc.data()});

        });

        generateDoctorsDatatable(doctors) //generate datatable


    });


}

const generateDoctorsDatatable = (doctors) => {

    if(document.getElementById("doctorsDataContainer"))
    {
        document.getElementById("doctorsDataContainer").innerHTML = "";


        $(".datatables-doctors-basic").DataTable().clear().draw();
    
    
        doctors.forEach((doctor) => {
    
            $(".datatables-doctors-basic").DataTable().row.add(doctor).draw();
    
        });
    }



}

//get Doctor by id
export const getSingleDoctorById = async(id) => {


    const documentReference = doc(firestore , `Doctors/${id}`);

    const product = await getDoc(documentReference);

    const currentObject = {id: product.id , ...product.data()};

    return currentObject;

}

//get All Doctor only one time
export const getAllDoctorsOnlyTime = async() => {

    return new Promise(async(resolve , reject) => {


        //get all user
        const collectionReference = collection(firestore , "Doctors");

        const w = where("status", "==", true);
        const q = query(collectionReference , w);

        let counter = 0;
        const currentDoctor = [];

        getDocs(q).then((docs) => {
            docs.forEach((doc) => {
                counter++;
                currentDoctor.push({id:doc.id , ...doc.data()});
                if(counter >= docs.size)
                {
                    resolve(currentDoctor);
                }
            });
            
        })
        .catch((data) => {
            reject(data);
        });

    })



}

//handle create product
export const createDoctorsHandle = (form) => {

    //get form Data
   return new Promise( async (resolve , reject) => {

       const currentObject =  getFormData(form);
       currentObject.description = tinyMCE.activeEditor.getContent();
       currentObject.profileImage = images;
       currentObject.createAt = `${new Date()}`;
       currentObject.lastUpdatedAt = "";
       currentObject.status = true;

       //validation
       const validationResult = validationDoctors(currentObject);

       if(validationResult.isValid)
       {   

           //change status of submit button and disabled it then show loading server

           document.getElementById("submitDoctors").classList.add("disabled");

            //check translation 
            if(localStorage.getItem("Translate"))
            {
                const language = localStorage.getItem("Translate");
                
                document.getElementById("submitDoctors").innerHTML = (language == "en")
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
                document.getElementById("submitDoctors").innerHTML = 
                `
                    <div class="spinner-border text-secondary me-1" role="status">
                        <span class="visually-hidden">Loading...</span> 
                    </div>
                    Loading...
                `


            }


           try
           {
               //upload images firstly 
 
                currentObject.profileImage = (currentObject.profileImage.length > 0)
                 ? await uploadImage(currentObject.profileImage[0] , "Doctors") 
                 : {imageUrl: "" , fullPath: ""};


                addDoc(collectionReference , currentObject).then(() => {

                    const result = new Result();
                    result.done = true;
                    
                    resolve(result);

                })
                .catch((data) => {

                    const result = new Result();
                    result.done = false;
                    result.messageError = data;
                    
                    reject(result);

                });
           }
           catch(error)
           {
                const result = new Result();
                result.done = false;
                result.messageError = error;
                
                reject(result);
           }

       }
       else
       {
           generateErrorList(validationResult.errorList);
       }

   });
   
}

//handle create Doctors
export const updateDoctorsHandle = (form , id) => {

    //get form Data
    return new Promise( async (resolve , reject) => {
        //old product
        const oldDoctor = await getSingleDoctorById(id);


        const currentObject = getFormData(form);
        currentObject.description = tinyMCE.activeEditor.getContent();
        currentObject.lastUpdatedAt = `${new Date()}`;
        currentObject.profileImage = images;

        //validation
        const validationResult = validationDoctors(currentObject);

        if(validationResult.isValid)
        {   

            //change status of submit button and disabled it then show loading server

            document.getElementById("submitDoctors").classList.add("disabled");

            //check translation 
            if(localStorage.getItem("Translate"))
            {
                const language = localStorage.getItem("Translate");
                
                document.getElementById("submitDoctors").innerHTML = (language == "en")
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
                document.getElementById("submitDoctors").innerHTML = 
                `
                    <div class="spinner-border text-secondary me-1" role="status">
                        <span class="visually-hidden">Loading...</span> 
                    </div>
                    Loading...
                `


            }


            try
            {
                if(images.length > 0) //already admin update images
                {
                    if(oldDoctor.profileImage.fullPath)
                    {
                        //delete image firstly
                        deleteImage(oldDoctor.profileImage.fullPath);
                    }


                    //upload images secondly 
                    currentObject.profileImage = await uploadImage(currentObject.profileImage[0] , "Doctors");
                }
                else
                {
                    currentObject.profileImage = oldDoctor.profileImage;
                }

                const documentReference = doc(firestore , `Doctors/${id}`);

                updateDoc(documentReference , currentObject).then(() => {
                    const result = new Result();
                    result.done = true;
                    
                    resolve(result);
                })
                .catch((data) => {
                    const result = new Result();
                    result.done = false;
                    result.messageError = data;
                    
                    reject(result);
                })

            }
            catch(error)
            {
                const result = new Result();
                result.done = false;
                result.messageError = error;
                
                reject(result);
            }

        }
        else
        {
            generateErrorList(validationResult.errorList);
        }

    });

}

//handle delete doctor 
//delete user by id
export const deleteDoctorHandle = async(id) => {

    try{

        const documentationReference = doc(firestore , "Doctors" , id);

        const doctor = await getSingleDoctorById(id);
        const fullPath = doctor.profileImage.fullPath;
        //check if user has image
        deleteDoc(documentationReference).then(() => {

            //check if user has image
            if(fullPath)
            {
                deleteImage(fullPath);
            }

        })
        .catch((data) => {
            console.log(data);
        })


    }
    catch(error)
    {
        console.log(error)
    }

}

//handle drag and drop
export const uploadImagesDragAndDrop = () => {
    const buttonUpload = document.querySelector(".top button");
    const browse = document.querySelector(".select");
    const input = document.querySelector(".form-upload input");

    browse.addEventListener("click" , () => { //to make input open from browse text

        input.click();

    });

    buttonUpload.addEventListener("click" , () => { //to make input open from browse text

        input.click();

    });


    //input change event
    input.addEventListener("change" , () => { 

        const imgs = Array.from(input.files);

        imgs.forEach((img) => { //add images from input in images array after chcek no consistency and length no more 5

            if(images.every((e) => {return e.name !== img.name}) && images.length < 5){
                images.push(img);
            }
            

        });

        input.value = ""; //empty file input 
        document.getElementById('previewImg').src = URL.createObjectURL(images[0]);
        showImages(images); //display in image container

    });


    //display selected images in container
    const showImages = (images) => {
        let cartona = "";

        images.forEach((img , index) => {

            cartona += 
            `
            <div class="image" style="margin-right:5px">
                <img src=${URL.createObjectURL(img)} alt="image">
                <span class="deleteImg" data-index=${index}>&times;</span>
            </div>
            `

        });

        document.querySelector(".image-container").innerHTML = cartona;
    }


    document.addEventListener("click" , (event) => {
        if(event.target.classList.contains("deleteImg")){
            images.splice(event.target.dataset.index , 1);
            document.getElementById('previewImg').src = "assets/images/avatar-placeholder.png";
            document.querySelector(".image-container").innerHTML =
            `
           
           <div class="image">
               <img src="assets/images/avatar-placeholder.png" alt="image">
               <span>&times;</span>
           </div>
           
           `
        }
    });



    
}


//handle product validation
export const validationObserver = () => {

    const doctorName = document.getElementById("doctorName");
    const doctorSpecialization = document.getElementById("doctorSpecialization");

    doctorName.onkeyup = function() {
        if(!doctorName.value) {
            doctorName.classList.remove("border-valid");
            doctorName.classList.add("border-invalid");
        }
        else
        {
            doctorName.classList.add("border-valid");
            doctorName.classList.remove("border-invalid");
        }
    }

    doctorSpecialization.onkeyup = function() {
        if(doctorSpecialization.value == "") {
            doctorSpecialization.classList.remove("border-valid");
            doctorSpecialization.classList.add("border-invalid");
        }
        else
        {
            doctorSpecialization.classList.add("border-valid");
            doctorSpecialization.classList.remove("border-invalid");
        }
    }

}

export const validationDoctors = (currentObject) => {

    const doctorName = document.getElementById("doctorName");
    const doctorSpecialization = document.getElementById("doctorSpecialization");


    const validationResult = new ValidationResult();
    validationResult.isValid = false;
    validationResult.errorList = [];

    let validName = true;
    let validSpecialization = true;



    //handle empty name
    if(!currentObject.name)
    {
        validationResult.errorList.push("Doctor Name must be required..!!");
        doctorName.classList.remove("border-valid");
        doctorName.classList.add("border-invalid");
        validName = false;
    }
    else
    {
        doctorName.classList.add("border-valid");
        doctorName.classList.remove("border-invalid");
    }

    if(!currentObject.specialization)
    {
        validationResult.errorList.push("Doctor Specialization must be required..!!");
        doctorSpecialization.classList.remove("border-valid");
        doctorSpecialization.classList.add("border-invalid");
        validSpecialization = false;
    }
    else
    {
        doctorSpecialization.classList.add("border-valid");
        doctorSpecialization.classList.remove("border-invalid");
    }


    
    if(validName && validSpecialization)
    {
        validationResult.isValid = true;
    }

    return validationResult;

}

//handle product validation generate error list from arr
export const generateErrorList = (errorList) => {

    document.querySelector(".errorList").innerHTML = "";


    const errorUl = document.createElement("ul");
    
    errorList.forEach(error => {

        const errorLi = document.createElement("li");
        const errorLiText = document.createTextNode(error);

        //style
        errorLi.classList.add("text-danger");

        //append text
        errorLi.appendChild(errorLiText);
        errorUl.appendChild(errorLi);

    });

    document.querySelector(".errorList").appendChild(errorUl);
}