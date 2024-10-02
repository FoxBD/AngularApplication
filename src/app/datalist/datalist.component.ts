import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AppService } from "../service/app.service";
import {ToastService} from "../toast/toast.service";

@Component({
  selector: 'app-datalist',
  templateUrl: './datalist.component.html',
  styleUrls: ['./datalist.component.scss']
})
export class DatalistComponent implements OnChanges {
  @Input() title: string = '';
  @Input() items: any[] = [];
  @Input() itemKey: string = '';
  // Output events if needed
  /*@Output() addItem = new EventEmitter<string>();
  @Output() editItem = new EventEmitter<number>();
  @Output() deleteItem = new EventEmitter<number>();*/

  constructor(private appService: AppService, public toastService: ToastService) { }

  isFormVisible: boolean = false;
  isEditing: boolean = false;

  itemsPerRow: number = 5;
  chunkedItems: any[][] = [];
  item: any = {};
  sendingItem: any = {};
  selectedFile: File | null = null;

  ngOnChanges() {
    this.chunkItems();
  }

  chunkItems() {
    this.chunkedItems = [];
    for (let i = 0; i < this.items.length; i += this.itemsPerRow) {
      this.chunkedItems.push(this.items.slice(i, i + this.itemsPerRow));
    }
    console.log(this.title.toLowerCase());
  }

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

  closeForm() {
    this.isFormVisible = false;
    this.item = {};
    this.selectedFile = null; // Reset selected file
  }

  saveChanges() {
    const service = this.title.toLowerCase();
    const nameElement = document.getElementById('name') as HTMLTextAreaElement;

    if (nameElement.textLength > 0) {
      if (service === 'fuel' || service === 'gorivo') {
        this.sendingItem = { name: nameElement.value };

        if (this.item.id) {
          this.appService.updateFuel(this.item.id, this.sendingItem).subscribe(() => {
            this.closeForm();
            this.toastService.add('Fuel updated. Reloading page...', 2000, 'success');
            window.location.reload();
          });
        } else {
          this.appService.addFuel(this.sendingItem).subscribe(() => {
            this.closeForm();
            this.toastService.add('New fuel added. Reloading page...', 2000, 'success');
            window.location.reload();
          });
        }
      } else if (service === 'brand' || service === 'znamka') {
        this.sendingItem = {
          name: nameElement.value,
          image: this.item.image || null,
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
