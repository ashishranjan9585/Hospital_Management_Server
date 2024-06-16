import { hospitalData } from "./hospitalData.js";
import  express from "express";
import {v4 as uuidv4} from "uuid" ;

const app = express();

app.use(express.json());

let  medicineInventory = hospitalData.medicalStaff.inventory.medicineInventory;

function isExpired(expirationDate) {
    const currentDate = new Date();
    const  expiredDate = new Date(expirationDate);
     //current date se  bda hona chaiye expired date
    return currentDate > expiredDate;
}

function triggerLowStockAlert(medicineName){
    console.log(`ALERT: Low stock for ${medicineName}. Please restock soon. `);

}

function checkAndUpdateStockStatus(medicine){
    if(medicine.quantity < 10) {
        triggerLowStockAlert(medicine.name);
    }
}

//*************************************************************************************************************** */

// Retrieves the medicine inventory  with optional filters for expired and low-stock medicines
app.get("/inventory/medicine" , (req ,res) => {
    const {expired , lowStock} = req.query;

    let filteredMedicineInventory = [...medicineInventory];
    if(expired === "true") {
        filteredMedicineInventory = filteredMedicineInventory.filter(
            (medicine) => medicine.quantity < 10
        );
    }
    res.json({ medicineInventory : filteredMedicineInventory });
});

//**************************************************************************************************************** */

//Adds a new  medicine  to the  inventory 
app.post("/inventory/medicine" , (req , res) => {
    const  newMedicine = req.body;

    if(!newMedicine.name || !newMedicine.quantity) {
        return res.status(400).json({
            msg :
            "Name and Quantity  are required for adding a new medicine to the inventory",
        });
    }
    if(newMedicine.quantity < 10) {
        triggerLowStockAlert(newMedicine.name);
    }

    medicineInventory.push(newMedicine);
    res.status(201).json({
        msg : "Medicine added to inventory successfully",
        medicine : newMedicine,
    });
    newMedicine.id = uuidv4();
});


//****************************************************************************************************************** */

//Update an existing medicine in the inventory 

app.put("/inventory/medicine/:id" , (req , res) => {
    const medicineId  = req.params.id;
    const updatedMedicine = req.body;

    if(!updatedMedicine.name && !updatedMedicine.quantity) {
        return res.status(400).json({
            msg :
            "Name and quantity is required for updating a medicine in the inventory ",
        });
    }

    const  index = medicineInventory.findIndex(
        (medicine) => medicine.id === medicineId
    );

    if(index != -1){
        medicineInventory[index] = {
            ...medicineInventory[index] , ...updatedMedicine ,
        };

        checkAndUpdateStockStatus(medicineInventory[index]);
        res.json({
            msg : "Medicine Updated Successfully" ,
            medicine : medicineInventory[index],
        });
}   else{
     res.status(404).json({
        msg : "Medicine is Not Found" ,
     })
}
});

//***************************************************************************************************************** */

//Deletes a medicines from the  inventory

app.delete("/inventory/medicine/:id" , (req , res) => {
    const  medicineId = req.params.id;
    console.log("Medicine" , medicineId);
    console.log(req);
    medicineInventory = medicineInventory.filter(
        (medicine) => medicine.id !== medicineId
    );
    console.log(medicineInventory);
    res.json({
        success : true ,
        msg : "Successfully deleted the medicine!" ,
    });
});

app.listen(3003 , () => {
    console.log("Server stared on port 3003");
})