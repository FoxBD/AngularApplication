import {Component, OnInit} from '@angular/core';
import {ToastService} from "../toast/toast.service";
import {AppService} from "../service/app.service";
import {Fuel} from "../models/fuel";
import {Brand} from "../models/brand";
import {Car} from "../models/car";
import {Router} from "@angular/router";

@Component({
  selector: 'app-caredit',
  templateUrl: './caredit.component.html',
  styleUrl: './caredit.component.scss'
})
export class CareditComponent implements OnInit {
  fuel: Fuel[] = [];
  brand: Brand[] = [];

  car: any = {};
  bearerUser: any = {};
  fullPath: string[] = [];
  isEditMode: boolean = false;

  selectedFile: File | null = null;
  constructor(private appService: AppService, private router: Router, public toastService: ToastService) {
  }
  ngOnInit() {
    this.fullPath = this.router.url.split('/')
    if (this.fullPath[1] === 'edit') {
      this.isEditMode = true;
      this.editExistingCar(this.fullPath[2]);
    }

    const bearerUserString = localStorage.getItem("bearer_user");
    if (bearerUserString) {
      this.bearerUser = JSON.parse(bearerUserString);
      console.log(this.bearerUser);

      this.appService.getFuel().subscribe(fuel => {
        this.fuel = fuel;
        this.appService.getBrand().subscribe(brand => {
          this.brand = brand;
        })
      })
    } else {// no id detected
      }
  }

  editExistingCar(carId: any): void {
    this.appService.getOneCar(carId).subscribe((response)=> {
      this.car = response;
      console.log(this.car)
    })
  }

  newCar() {
    let allFilled = true;

    const brandElement = document.getElementById('brand') as HTMLSelectElement;
    const modelElement = document.getElementById('model') as HTMLInputElement;
    const mileageElement = document.getElementById('mileage') as HTMLInputElement;
    const fuelElement = document.getElementById('fuel') as HTMLSelectElement;
    const yearElement = document.getElementById('year') as HTMLInputElement;
    const doorNumElement = document.getElementById('doorNum') as HTMLInputElement;
    const descriptionElement = document.getElementById('description') as HTMLTextAreaElement;
    const engineElement = document.getElementById('engine') as HTMLInputElement;
    const priceElement = document.getElementById('price') as HTMLInputElement;

    if (!brandElement.value) {
      allFilled = false;
    } else {
      this.car.brand = brandElement.value;
    }

    if (!modelElement.value) {
      allFilled = false;
    } else {
      this.car.model = modelElement.value;
    }

    if (this.car.mileage < 0) {
      this.toastService.add('Car can\'t have negative miles', 2000, 'error');
    } else {
      this.car.mileage = mileageElement.value;
    }

    if (!fuelElement.value) {
      allFilled = false;
    } else {
      this.car.fuel = fuelElement.value;
    }

    if (!yearElement.value) {
      allFilled = false;
    } else {
      this.car.year = yearElement.value;
    }

    if (!doorNumElement.value) {
      allFilled = false;
    } else {
      this.car.doorNum = doorNumElement.value;
    }

    this.car.description = descriptionElement.value;

    if (!engineElement.value) {
      allFilled = false;
    } else {
      this.car.engine = engineElement.value;
    }

    if (this.car.price < 0) {
      this.toastService.add('Prices value must be positive', 2000, 'error');
    } else {
      this.car.price = priceElement.value;
    }


    if (allFilled) {
      if (this.fullPath[1] === 'add') {
        // seller is set only on ADDING...
        this.car.seller = this.bearerUser.id
        this.appService.addCar(this.car).subscribe((response) => {
          this.toastService.add('Car created', 2000, 'success');
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        })
      } else if (this.fullPath[1] === 'edit') {
        this.appService.updateCar(this.fullPath[2], this.car).subscribe((response) => {
          this.toastService.add('Car updated', 2000, 'success');
        })
      }
    } else {
      this.toastService.add('Some values were not filled', 2000, 'error');
    }
  }

  deleteCar() {
    this.appService.deleteCar(+this.fullPath[2]).subscribe((response) => {
      this.toastService.add('Car deleted', 2000, 'success');
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    })
  }

  onFileSelected(event: Event, image: number) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (image === 1)
          this.car.image1 = e.target?.result as string;
        else if (image === 2)
          this.car.image2 = e.target?.result as string;
        else if (image === 3)
          this.car.image3 = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
