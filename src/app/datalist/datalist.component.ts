import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AppService } from "../service/app.service";
import {ToastService} from "../toast/toast.service";

@Component({
  selector: 'app-datalist',
  templateUrl: './datalist.component.html',
  styleUrls: ['./datalist.component.scss']
})
export class DatalistComponent implements OnChanges {
  // Component for two data views on admin page
  // this is being sent from admin to this component
  @Input() title: string = '';
  @Input() items: any[] = [];
  @Input() itemKey: string = '';
  item: any = {};

  // appService has routes for every get, post or edit function
  // toastService shows informative popups to user, I use them to indicate error when filling forms or show success on successful login or create
  constructor(private appService: AppService, public toastService: ToastService) { }

  // used for showing / hiding edit / create form for both brand and fuel
  isFormVisible: boolean = false;
  isEditing: boolean = false;

  // items for both brand and fuel are similarly to last 10 cars in home page being displayed in 2d array
  itemsPerRow: number = 5;
  chunkedItems: any[][] = [];

  // separate vars for handling adding images to brands
  sendingItem: any = {};
  selectedFile: File | null = null;

  ngOnChanges() {
    this.chunkItems();
  }

  // component on init already receives arrays filled with DB data, this function only positions it in 2d array
  chunkItems() {
    this.chunkedItems = [];
    for (let i = 0; i < this.items.length; i += this.itemsPerRow) {
      this.chunkedItems.push(this.items.slice(i, i + this.itemsPerRow));
    }
    console.log(this.title.toLowerCase());
  }

  // function shows new element below the displayed items, if it has item then it'll be used for editing and if not then for creating
  openEditForm(item: any) {
    console.log(item)
    this.item = {};
    this.isEditing = false;

    if (item) {
      this.item = { ...item };
      this.isEditing = true;
    }

    this.isFormVisible = true;
  }

  // function hides new element below the displayed items
  closeForm() {
    this.isFormVisible = false;
    this.item = {};
    this.selectedFile = null; // Reset selected file
  }

  // called whenever edit/create forms save is pressed
  saveChanges() {
    // first it checks field Name if it's filled
    const service = this.title.toLowerCase();
    const nameElement = document.getElementById('name') as HTMLTextAreaElement;

    if (nameElement.textLength > 0) { // if it is, it then decides if form is called by fuel or brand (this is gathered from data got from admin component)
      if (service === 'fuel' || service === 'gorivo') {
        this.sendingItem = { name: nameElement.value };

        if (this.item.id) { // if item has id, it'll update it, at the end it reloads the page
          this.appService.updateFuel(this.item.id, this.sendingItem).subscribe(() => {
            this.closeForm();
            this.toastService.add('Fuel updated. Reloading page...', 2000, 'success');
            window.location.reload();
          });
        } else { // if not, it'll create it, at the end it reloads the page
          this.appService.addFuel(this.sendingItem).subscribe(() => {
            this.closeForm();
            this.toastService.add('New fuel added. Reloading page...', 2000, 'success');
            window.location.reload();
          });
        }
      } else if (service === 'brand' || service === 'znamka') { // brand in addition to name also sends over image data
        this.sendingItem = {
          name: nameElement.value,
          image: this.item.image || null, // image selected before in function onFileSelected(), here it's just set to item instance
          mimetype: null
        };

        console.log(this.sendingItem)

        if (this.item.id) {
          this.appService.updateBrand(this.item.id, this.sendingItem).subscribe(() => {
            this.closeForm();
            this.toastService.add('Brand updated. Reloading page...', 2000, 'success');
            window.location.reload();
          });
        } else {
          this.appService.addBrand(this.sendingItem).subscribe(() => {
            this.closeForm();
            this.toastService.add('New brand added. Reloading page...', 2000, 'success');
            window.location.reload();
          });
        }
      }
    } else {
      console.log("Throw exception // toast error name not filled");
    }
  }

  // function deletes item, closes edit / creation form and reloads the page
  // the correct api endpoint is gathered from data got from admin component
  deleteItem() {
    const service = this.title.toLowerCase();
    if (service === 'fuel' || service === 'gorivo') {
      this.appService.deleteFuel(this.item.id).subscribe(() => {
        this.closeForm();
        this.toastService.add('Fuel deleted. Reloading page...', 2000, 'success');
        window.location.reload();
      });
    } else if (service === 'brand' || service === 'znamka') {
      this.appService.deleteBrand(this.item.id).subscribe(() => {
        this.closeForm();
        this.toastService.add('Brand deleted. Reloading page...', 2000, 'success');
        window.location.reload();
      });
    }
  }

  // function that handles image selection. First it opens file explorer, transforms image to string and then its saved as URL
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.item.image = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
