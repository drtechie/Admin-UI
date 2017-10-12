import { Component, OnInit,Inject } from '@angular/core';
import { HospitalMasterService } from '../services/ProviderAdminServices/hospital-master-service.service';
import { dataService } from '../services/dataService/data.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationDialogsService } from '../services/dialog/confirmation.service';


@Component({
    selector: 'app-hospital-master',
    templateUrl: './hospital-master.component.html',
    styleUrls: ['./hospital-master.component.css']
})
export class HospitalMasterComponent implements OnInit {
    /*ngModels*/
    serviceProviderID:any;
    providerServiceMapID:any;
    state:any;
    service:any;
    district:any;
    taluk:any;

    institutionName:any;
    address:any;
    website:any;
    contact_person_name:any;
    contact_number:any;
    emailID:any;

    /*arrays*/
    states:any=[];
    services:any=[];
    districts:any=[];
    taluks:any=[];

    searchResultArray:any=[];

    /*flags*/
    disabled_flag:boolean=false;
    showTableFlag:boolean=false;
    showFormFlag:boolean=false;

    /*regEx*/
    website_expression:any=/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    email_expression:any=/^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|in|co.in)\b$/;

    constructor(public HospitalMasterService:HospitalMasterService,
                public commonDataService:dataService,
                public dialog:MdDialog,
                public alertService:ConfirmationDialogsService) 
    {
        this.serviceProviderID=this.commonDataService.service_providerID;
    }

    ngOnInit() {
        this.HospitalMasterService.getStates(this.serviceProviderID).subscribe(response=>this.getStatesSuccessHandeler(response));
    }

    clear()
    {
        this.state="";
        this.service="";
        this.district="";
        this.taluk="";

        this.searchResultArray=[];

        this.showTableFlag=false;
    }

    showForm()
    {
        this.disabled_flag=true;
        this.showTableFlag=false;
        this.showFormFlag=true;
    }

    back()
    {
        this.disabled_flag=false;
        this.showTableFlag=true;
        this.showFormFlag=false;

        this.institutionName="";
        this.address="";
        this.website="";
        this.contact_person_name="";
        this.contact_number="";
        this.emailID="";

    }

    getStatesSuccessHandeler(response)
    {
        if(response)
        {
            this.states=response;   
        }
    }

    getServices(stateID)
    {
        this.service="";
        this.district="";
        this.taluk="";

        this.HospitalMasterService.getServices(this.serviceProviderID,stateID).subscribe(response=>this.getServiceSuccessHandeler(response));
    }

    getServiceSuccessHandeler(response)
    {
        if(response)
        {
            this.services=response;
        }
    }

    getDistrict(stateID)
    {
        this.service="";
        this.district="";
        this.taluk="";

        this.HospitalMasterService.getDistricts(stateID).subscribe(response=>this.getDistrictSuccessHandeler(response));

    }

    getDistrictSuccessHandeler(response)
    {
        console.log(response,"Districts");
        if(response)
        {
            this.districts=response;
        }
    }

    getTaluk(districtID)
    {
        this.taluk="";
        this.HospitalMasterService.getTaluks(districtID).subscribe(response=>this.getTalukSuccessHandeler(response));
    }

    getTalukSuccessHandeler(response)
    {
        console.log(response,"Taluk")
        if(response)
        {
            this.taluks=response;
        }
    }

    setProviderServiceMapID(providerServiceMapID)
    {
        this.district="";
        this.taluk="";
        this.providerServiceMapID=providerServiceMapID;
    }


    /*CRUD OPERATIONS */

    /*GET institution*/
    getInstitutions()
    {
        let request_obj={
            "providerServiceMapID" : this.providerServiceMapID,
            "stateID" : this.state,
            "districtID" : this.district,
            "blockID": this.taluk
        }
        this.HospitalMasterService.getInstitutions(request_obj).subscribe(response=>this.getInstitutionSuccessHandeler(response));
    }

    getInstitutionSuccessHandeler(response)
    {
        console.log(response,"GET HOSPITAL LIST");
        if(response)
        {
            this.showTableFlag=true;
            this.searchResultArray=response;
        }
    }

    /*activate/deactivate an institution*/
    toggleActivate(institutionID,toBeDeactivatedFlag)
    {
        if(toBeDeactivatedFlag===true)
        {
            this.alertService.confirm("Are you sure you want to Deactivate?").subscribe(response=>{
                if(response)
                {
                    let obj={
                        "institutionID":institutionID,
                        "deleted":toBeDeactivatedFlag
                    };

                    this.HospitalMasterService.deleteInstitution(obj).subscribe(response=>this.deleteInstitutionSuccessHandeler(response,"Deactivated"));
                }
            })

        }

        if(toBeDeactivatedFlag===false)
        {
            this.alertService.confirm("Are you sure you want to Activate?").subscribe(response=>{
                if(response)
                {
                    let obj={
                        "institutionID":institutionID,
                        "deleted":toBeDeactivatedFlag
                    };

                    this.HospitalMasterService.deleteInstitution(obj).subscribe(response=>this.deleteInstitutionSuccessHandeler(response,"Activated"));
                }
            })

        }
    }

    deleteInstitutionSuccessHandeler(response,action)
    {
        if(response)
        {
            this.alertService.alert(action+" Successfully!")
            this.getInstitutions();
        }
    }

    /*create institution*/
    createInstitution(value_object)
    {
        let request_Array=[];
        let request_obj={

            "institutionName": value_object.institutionName,
            "stateID": this.state,
            "districtID":this.district,
            "blockID": this.taluk,
            "address": value_object.address,
            "contactPerson1": value_object.contact_person_name,
            "contactPerson1_Email": value_object.emailID,
            "contactNo1": value_object.contact_number,
            "contactPerson2": "",
            "contactPerson2_Email": "",
            "contactNo2": "",
            "contactPerson3": "",
            "contactPerson3_Email": "",
            "contactNo3": "",
            "website": value_object.website,
            "providerServiceMapID": this.providerServiceMapID,
            "createdBy": this.commonDataService.uname

        }

        request_Array.push(request_obj);

        this.HospitalMasterService.saveInstitution(request_Array).subscribe(response=>this.saveInstitutionSuccessHandeler(response))

    }

    saveInstitutionSuccessHandeler(response)
    {
        console.log(response,"SAVE INSTITUTION SUCCESS HANDELER");
        if(response)
        {
            this.alertService.alert("Institution Saved Successfully!!");
            this.back();
            this.getInstitutions();
        }
    }

    openEditModal(toBeEditedObject)
    {
        let dialog_Ref = this.dialog.open(EditHospitalModal, {
            height: '400px',
            width: '700px',
            data: toBeEditedObject
        });

        dialog_Ref.afterClosed().subscribe(result => {
             console.log(`Dialog result: ${result}`);
             if (result === "success") {
                     this.getInstitutions();
                 }

                });
    }

}

@Component({
    selector: 'edit-hospital-modal',
    templateUrl: './edit-hospital-modal.html'
})
export class EditHospitalModal {

    /*ngModels*/
    institutionName:any;
    address:any;
    website:any;
    contact_person_name:any;
    contact_number:any;
    emailID:any;

    /*regEx*/
    website_expression:any=/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    email_expression:any=/^[0-9a-zA-Z_.]+@[a-zA-Z_]+?\.\b(org|com|in|co.in)\b$/;


    constructor( @Inject(MD_DIALOG_DATA) public data: any, public dialog: MdDialog,
                public HospitalMasterService:HospitalMasterService,
                public commonDataService:dataService,
                public dialogReff: MdDialogRef<EditHospitalModal>) { }

    ngOnInit()
    {
        console.log("MODAL DATA",this.data);
        this.institutionName=this.data.institutionName;
        this.address=this.data.address;
        this.website=this.data.website;
        this.contact_person_name=this.data.contactPerson1;
        this.contact_number=this.data.contactNo1;
        this.emailID=this.data.contactPerson1_Email;
    }

    update(editedData)
    {
        console.log(editedData,"editedData");
        let edit_request_obj={
                "institutionID" : this.data.institutionID,
                "institutionName" : editedData.institutionName,
                "address" :editedData.address,
                "contactPerson1" : editedData.contact_person_name,
                "contactPerson1_Email" : editedData.emailID,
                "contactNo1" : editedData.contact_number,
                "contactPerson2" : this.data.contactPerson2,
                "contactPerson2_Email" : this.data.contactPerson2_Email,
                "contactNo2" : this.data.contactNo2,
                "contactPerson3" : this.data.contactPerson3,
                "contactPerson3_Email" :this.data.contactPerson3_Email,
                "contactNo3" : this.data.contactNo3,
                "website" : editedData.website,
                "providerServiceMapID":this.data.providerServiceMapID,
                "modifiedBy" : this.commonDataService.uname
                }

         this.HospitalMasterService.editInstitution(edit_request_obj).subscribe(response=>this.editInstitutionSuccessHandeler(response));
    }


    editInstitutionSuccessHandeler(response)
    {
        console.log("edit success",response);
        if(response)
        {
            this.dialogReff.close("success");
        }
    }        

}