//imports
import { collection, onSnapshot, } from "firebase/firestore";
import {app, firestore} from "../../main"




$( document ).ready(function() {
    $(".overlay-loading").hide();
});

//landing slider
$('.landing-slider').slick({
    autoplay: true,
    autoplaySpeed: 5000,
    prevArrow: `<span class="landing-arrow-left"><i class="fa-solid fa-chevron-left"></i></span>`,
    nextArrow: `<span class="landing-arrow-right"><i class="fa-solid fa-chevron-right"></i></span>`,
});





//imports
import gsap from "https://esm.sh/gsap";
import { getAllDoctorsOnlyTime } from "../../Adminpanel/Doctors/assets/js/doctors";
import { getAllClinicsOnlyTime } from "../../Adminpanel/Clinics/assets/js/clinics";

//constants
const windowHeight = document.documentElement.clientHeight;
//gallery
const gallerySection = document.getElementById("gallery");
const gallerySectionPosition = gallerySection.offsetTop - windowHeight;
let galleryGenerated = true;
    //on scroll
window.addEventListener("scroll" , () => {
    if(scrollY >= gallerySectionPosition)
    {  
        if(galleryGenerated)
        {   
            galleryGenerated = false;
            const images = document.querySelectorAll(".gallery-grid .gallery-img-link");
            const imagesTimeline = gsap.timeline();
            images.forEach((image, index) => {
                imagesTimeline.fromTo(
                image,
                { x: "120%", opacity: 0, delay: index * 0,width:'2rem' },
                { x: "0%", opacity: 1,width:"100%" }
                );
            });
        }


    }

});

//doctors slider
$('.doctors-slider').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    prevArrow: `<span class="landing-arrow-left ms-2"><i class="fa-solid fa-chevron-left"></i></span>`,
    nextArrow: `<span class="landing-arrow-right me-2"><i class="fa-solid fa-chevron-right"></i></span>`,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            }
        },
        {
            breakpoint: 768,
            settings: {
            slidesToShow: 2,
            slidesToScroll: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
            slidesToShow: 1,
            slidesToScroll: 1
            }
        }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
})

//get All Doctors and display it in home page
const displayDoctors = () => {

    const collectionReference = collection(firestore , "Doctors");

    setInterval(() => {
        
    })
    onSnapshot(collectionReference , async(snapshot) => {
        
        if(snapshot.empty)
        {
            getAllDoctorsOnlyTime().then((data) => {
                displayDoctorsGenerator(data);
            });

        }
        else
        {
            const doctors = [];
            snapshot.docs.forEach((doc) => {
    
                doctors.push({id: doc.id , ...doc.data()});
    
            })
    
            displayDoctorsGenerator(doctors);
        }


    });


}

const displayDoctorsGenerator = (doctors) => {

    let cartona = ``;
    doctors.forEach((doctor) => {

        cartona = `

        <div class="doctor-slide px-2">
            <div class="card" style="width: 100%;">
                <div class="card-img">
                <img src="${(doctor.profileImage.imageUrl) ? doctor.profileImage.imageUrl : 'Hospital/Home/images/Doctors/mostafa-khalel.png'}" class="card-img-top doc-img" alt="doctors">
                </div>
                <div class="card-body py-2">
                <h4 class="doc-name mb-2" title="${doctor.name.toString()}">${doctor.name.toString().substring(0 , 40)}</h4>
                <h6 class="doc-specialization mb-2" title="${doctor.specialization.toString()}">${doctor.specialization}</h6>
                <p class="card-text doc-bio">We are looking to hire a doctor with outstanding medical knowledge and excellent counseling skills.</p>
                </div>
            </div>
        </div>
        `
        $('.doctors-slider').slick('slickAdd',cartona);

    });

}



//clinic slider
$('.clinic-slider').slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    prevArrow: `<span class="landing-arrow-left ms-2"><i class="fa-solid fa-chevron-left"></i></span>`,
    nextArrow: `<span class="landing-arrow-right me-2"><i class="fa-solid fa-chevron-right"></i></span>`,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            }
        },
        {
            breakpoint: 768,
            settings: {
            slidesToShow: 1,
            slidesToScroll: 1
            }
        },
        {
            breakpoint: 480,
            settings: {
            slidesToShow: 1,
            slidesToScroll: 1
            }
        }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
});

//get All Clinics and display it in home page
const displayClinics = () => {
    const collectionReference = collection(firestore , "Clinics");

    onSnapshot(collectionReference , (snapshot) => {
        if(snapshot.empty)
        {
            getAllClinicsOnlyTime().then((data) => {
                displayClinicsGenerator(data);
                console.clear();
            });
        }
        else
        {
            const Clinics = [];
            snapshot.docs.forEach((doc) => {
    
                Clinics.push({id: doc.id , ...doc.data()});
    
            });


            displayClinicsGenerator(Clinics);

        }



    });

}




const displayClinicsGenerator = (Clinics) => {

    let cartona = ``;
    Clinics.forEach((Clinic) => {

        cartona = `
    
        <div class="clinic-slide px-2">
            <div class="card" style="width: 100%">
            <div class="card-img">
                <img src="${Clinic.clinicImage.imageUrl}" class="card-img-top clinic-img" alt="clinic">
            </div>
            </div>
        </div>
        `
        $('.clinic-slider').slick('slickAdd',cartona);


    });


}

const images = document.querySelectorAll(".gallery-img-link img");
let imgIndex = 0;

//light box custom 
document.querySelectorAll(".gallery-img-link").forEach((element) => {
    element.addEventListener("click" , (event) => {


        event.preventDefault();

        
        imgIndex = element.dataset.index;
        document.querySelector(".image-center").src = images[imgIndex].src;

        document.querySelector(".lightBox-overlay").style.opacity = "1";
        document.querySelector(".lightBox-overlay").style.zIndex = "1000000000000";
    });
    
})

document.querySelector(".lightBox-overlay").addEventListener("click" , () => {

    document.querySelector(".lightBox-overlay").style.opacity = "0";
    document.querySelector(".lightBox-overlay").style.zIndex = "-1000";

});

document.querySelector(".lightbox-arrow-left").addEventListener("click" , (event) => {
    
    event.stopPropagation();

    imgIndex--;

    if(imgIndex < 0)
    {
        imgIndex = images.length - 1;
        document.querySelector(".image-center").src = images[imgIndex].src;
    }
    else
    {
        document.querySelector(".image-center").src = images[imgIndex].src;
    }

} , false);

document.querySelector(".lightbox-arrow-right").addEventListener("click" , (event) => {
    
    event.stopPropagation();

    imgIndex++;

    if(imgIndex > (images.length - 1))
    {
        imgIndex = 0;
        document.querySelector(".image-center").src = images[imgIndex].src;
    }
    else
    {
        document.querySelector(".image-center").src = images[imgIndex].src;
    }

} , false);

displayDoctors();
displayClinics();
