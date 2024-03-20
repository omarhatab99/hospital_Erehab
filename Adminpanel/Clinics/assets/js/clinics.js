//imports
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";
import { Result, ValidationResult } from "../../../Shared/modules";
import {deleteImage, uploadImage} from "../../../Shared/Extension"
import { firestore } from "../../../../main";

//constants

const collectionReference = collection(firestore , "Clinics");




//get all user to display it in datatable
export const getAllClinic = () => {

    //get all user
    onSnapshot(collectionReference , (snapshot) => {


        const clinics = [];

        snapshot.docs.forEach((doc) => {

            clinics.push({id: doc.id , ...doc.data()});

        });


        generateClinicsDatatable(clinics) //generate datatable


    });


}

const generateClinicsDatatable = (clinics) => {

    if(document.getElementById("clinicsDataContainer"))
    {
        document.getElementById("clinicsDataContainer").innerHTML = "";


        $(".datatables-clinics-basic").DataTable().clear().draw();
    
    
        clinics.forEach((clinic) => {
    
            $(".datatables-clinics-basic").DataTable().row.add(clinic).draw();
    
        });
    }



}

//Get single clinic by id 
export const getClinicById = (id) => {

    return new Promise((resolve , reject) => {

        const documentationReference = doc(firestore , "Clinics" , id);

        let clinic = new Object();
    
        getDoc(documentationReference).then((snapshot) => {
    
            
            clinic = {id: snapshot.id , ...snapshot.data()};

    
            resolve(clinic);
    
        })
        .catch((rejectedData) => {
            reject(rejectedData);
        })

    });


}

//get All Clinics only one time
export const getAllClinicsOnlyTime = async() => {

    return new Promise(async(resolve , reject) => {


        //get all user
        const collectionReference = collection(firestore , "Clinics");

        const w = where("status", "==", true);
        const q = query(collectionReference , w);

        let counter = 0;
        const currentClinics = [];

        getDocs(q).then((docs) => {
            docs.forEach((doc) => {
                counter++;
                currentClinics.push({id:doc.id , ...doc.data()});
                if(counter >= docs.size)
                {
                    resolve(currentClinics);
                }
            });
            
        })
        .catch((data) => {
            reject(data);
        });

    })



}


//handle create clinic
export const createClinicHandle = (currentObject) => {

    return new Promise(async(resolve , reject) => {

        try{

            //upload image
            currentObject.clinicImage = await uploadImage(currentObject.clinicImage , "Clinics");

            //get Data from form 
            addDoc(collectionReference , currentObject).then((data) => {
                 const clinicResult = new Result();
                 clinicResult.done = true;
                 clinicResult.result = data;

                 resolve(clinicResult);

             })
             .catch((data) => {
                 const clinicResult = new Result();
                 clinicResult.done = false;
                 clinicResult.messageError = data;

                 reject(clinicResult);
             })

        }
        catch(error)
        {

            const clinicResult = new Result();
            clinicResult.done = false;
            clinicResult.messageError = error;

            reject(clinicResult);

        }


    });


}



//handle clinic update
export const updateClinicHandle = (currentObject , id) => {

    return new Promise(async(resolve , reject) => {

        const oldClinic = await getClinicById(id);
        const documentationReference = doc(firestore , "Clinics" , id);


        try {
            //check if admin send photo 
            if(currentObject.clinicImage.name) 
            {
                if(oldClinic.clinicImage.fullPath)
                {
                    deleteImage(oldClinic.clinicImage.fullPath);
                }

                currentObject.clinicImage = await uploadImage(currentObject.clinicImage , "Clinics");
            }
            else
            {
                currentObject.clinicImage = oldClinic.clinicImage;
            }
            //upload data
            currentObject.lastUpdatedAt = `${new Date()}`;
            updateDoc(documentationReference , currentObject).then(() => {
                const result = new Result();
                result.done = true;

                resolve(result);
            })
            .catch((error) => {

                const result = new Result();
                result.messageError = error;
                result.done = false;
    
                reject(result);

            })
        }
        catch(error)
        {
            const result = new Result();
            result.messageError = error;
            result.done = false;

            reject(result);
        }

    });

}


//delete clinic by id
export const deleteClinicHandle = async(id) => {

    try{

        const documentationReference = doc(firestore , "Clinics" , id);

        const clinic = await getClinicById(id);
        const fullPath = clinic.clinicImage.fullPath;
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

export const clinicValidation = (currentObject , operation) => {

    const validationResult = new ValidationResult();
    validationResult.isValid = false;

    if(!currentObject.name)
    {
        validationResult.messageError = "Clinic Name must be required..!!";
        validationResult.isValid = false;
    }
    else if(!currentObject.clinicImage.name && operation == "CREATE")
    {
        validationResult.messageError = "Clinic Image must be required..!!";
        validationResult.isValid = false;
    }
    else
    {
        validationResult.isValid = true;
        validationResult.messageError = "";
    }

    return validationResult;

}
