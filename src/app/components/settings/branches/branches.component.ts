import { Component } from '@angular/core';
import { Branch, Category } from '../../../models';
import { BranchesInterface } from '../../../interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FixMeLater, QRCodeElementType, QRCodeErrorCorrectionLevel } from 'angularx-qrcode';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss'
})
export class BranchesComponent {
  constructor(
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private branchsServices: BranchesInterface){
    this.elementType = "canvas" as QRCodeElementType;
  }

  branches: Branch[] =[];
  branch: Branch = {};
  visibleModal: boolean = false;
  visibleQRModal: boolean = false;
  isEdit:boolean = false;

  public qrData = {
    allowEmptyString: true,
    alt: "QR Code de sucursal",
    ariaLabel: `QR Code para vincular sucursal como favorito`,
    colorDark: "#000000ff",
    colorLight: "#ffffffff",
    cssClass: "center",
    elementType: "canvas" as QRCodeElementType,
    errorCorrectionLevel: "M" as QRCodeErrorCorrectionLevel,
    imageSrc: "./assets/layout/images/logo-dark.svg",
    imageHeight: 75,
    imageWidth: 150,
    margin: 4,
    qrdata: "",
    scale: 1,
    version: undefined,
    title: "QR de Sucursal",
    width: 300,
  }

  public elementType: QRCodeElementType;

  ngOnInit(): void {
    this.getbranches();
  }
  getbranches(){
    this.branchsServices.getItemsByInstance().subscribe({
      next: (data) => {
        this.branches = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    })
  }
  showModal(isEdit:boolean = false, item?:Branch){
    this.isEdit = isEdit;
    if(isEdit)
      this.branch = item!;
    else
      this.branch = new Branch();

    this.visibleModal =  true;
  }
  confirmSave(){
    if(this.isEdit){
      this.branchsServices.updateItem(this.branch!.id!,this.branch).subscribe({
        next: (data) => this.getbranches(),
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    else{
      this.branchsServices.createItem(this.branch).subscribe({
        next: (data) => this.getbranches(),
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    this.visibleModal = false;
  }
  confirmDeleted(item:Category) {
    this.confirmationService.confirm({
        header: 'Estas seguro de eliminar?',
        message: 'Por favor de confirmar.',
        accept: () => {
          this.branchsServices.deleteItem(this.branch!.id!).subscribe({
            next: (data) => this.getbranches(),
            error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
          });
        }
    });
  }

  showQRModal(item: Branch) {
    if (!item.identity) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Esta sucursal no tiene un código QR válido. Por favor, recarga la página.'
      });
      return;
    }

    this.branch = item;
    // Use current origin for QR URL to work in any environment
    const origin = window.location.origin;
    this.qrData.qrdata = `${origin}/client-portal/link-branch/${item.identity}`;
    this.visibleQRModal = true;
  }

  saveQRAsImage(parent: FixMeLater) {
    let parentElement = null

    if (this.elementType === "canvas") {
      // fetches base 64 data from canvas
      parentElement = parent.qrcElement.nativeElement
        .querySelector("canvas")
        .toDataURL("image/png")
    } else if (this.elementType === "img" || this.elementType === "url") {
      // fetches base 64 data from image
      parentElement = parent.qrcElement.nativeElement.querySelector("img").src
    } else {
      alert("Set elementType to 'canvas', 'img' or 'url'.")
    }

    if (parentElement) {
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(parentElement)
      // saves as image
      const blob = new Blob([blobData], { type: "image/png" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      // name of the file
      link.download = `qr-sucursal-${this.branch.name || 'branch'}`
      link.click()
    }

    this.visibleQRModal = false;
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(";base64,")
    // hold the content type
    const imageType = parts[0].split(":")[1]
    // decode base64 string
    const decodedData = window.atob(parts[1])
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length)
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType })
  }
}
