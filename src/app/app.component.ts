import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeModel } from './model/Employee';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  
employeeForm:FormGroup=new FormGroup({});
employeeObj:EmployeeModel=new EmployeeModel();
employeeList:EmployeeModel[]=[];
 isEditMode: boolean = false;

constructor(){
  this.createForm();
}

   ngOnInit(): void {
    // FIX: Only run localStorage code in the browser
    if (typeof window !== 'undefined' && window.localStorage) {
      const oldData = localStorage.getItem("EmpData");
      if (oldData != null) {
        const ParseData=JSON.parse(oldData);
      this.employeeList = ParseData;
      }
    }
  }
 createForm() {
    this.employeeForm = new FormGroup({
      empid: new FormControl(this.employeeObj.empId),
      name: new FormControl(this.employeeObj.name,[Validators.required]),
      city: new FormControl(this.employeeObj.city,[Validators.required]),
      address: new FormControl(this.employeeObj.address,[Validators.required]),
      contactNo: new FormControl(this.employeeObj.contactNo,[Validators.required]),
      emailId: new FormControl(this.employeeObj.emailId,[Validators.required]),
      state: new FormControl(this.employeeObj.state,[Validators.required]),
      pinCode: new FormControl(this.employeeObj.pinCode,[Validators.required])
    });
  }

  onSave(){
       // ensure we are in Add mode
    this.isEditMode = false;
    const oldDate = localStorage.getItem("EmpData");
    if(oldDate!=null){
      //alert("Record Added Successfully");
      const ParseData=JSON.parse(oldDate);
      this.employeeForm.controls['empid'].setValue(ParseData.empId+1);
      this.employeeList.unshift(this.employeeForm.value);
      
    }
    else{
      //alert("First Record Added");
      this.employeeList.unshift(this.employeeForm.value);
     
    }
     localStorage.setItem("EmpData",JSON.stringify(this.employeeList));
      this.onReset();
  }

  onEdit(item:EmployeeModel){
     // enter edit mode
    this.isEditMode = true;
    this.employeeObj=item;
    this.createForm();

  }

  onUpdate(){
    const record = this.employeeList.find(x => x.empId == this.employeeForm.controls['empid'].value);
   if(record != undefined){
    record.name=this.employeeForm.controls['name'].value;
    record.city=this.employeeForm.controls['city'].value;
    record.address=this.employeeForm.controls['address'].value;
    record.contactNo=this.employeeForm.controls['contactNo'].value;
    record.emailId=this.employeeForm.controls['emailId'].value;
    record.state=this.employeeForm.controls['state'].value;
    record.pinCode=this.employeeForm.controls['pinCode'].value;
   }
   localStorage.setItem("EmpData",JSON.stringify(this.employeeList));
   // return to add mode after update
    this.isEditMode = false;
   this.onReset();
  }

  onDelete(itemId: number) {
    const isDelete = confirm("Are you sure to delete this record?");
    if (isDelete) {
      const index = this.employeeList.findIndex(x => (x as any).empId == itemId);
      if (index > -1) {
        this.employeeList.splice(index, 1);
        localStorage.setItem("EmpData", JSON.stringify(this.employeeList));
      }
    }
  }

  onReset() {
    // reset form controls (we'll re-set empid after)
    this.employeeForm.reset();
  }
}
