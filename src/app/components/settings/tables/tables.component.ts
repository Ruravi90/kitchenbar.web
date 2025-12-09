import { Component } from '@angular/core';
import { Branch, Table } from '../../../models';
import { BranchesInterface, TablesInterface, DashboardInterface } from '../../../interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FixMeLater, QRCodeElementType, QRCodeErrorCorrectionLevel } from 'angularx-qrcode';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent {

  constructor( 
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private tablesServices: TablesInterface,
    private branchesService: BranchesInterface,
    private dashboardService: DashboardInterface){
    this.elementType= "canvas" as QRCodeElementType;
  }

  tables: Table[] = [];
  branches: Branch[] = [];
  table: Table = {}
  visibleModal: boolean = false;
  visibleQRModal:boolean = false;
  isEdit:boolean = false;
  public qrData = {
    allowEmptyString: true,
    alt: "A custom alt attribute",
    ariaLabel: `QR Code image with the following content...`,
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
    title: "A custom title attribute",
    width: 300,
  }

  public elementType: QRCodeElementType;

  ngOnInit(): void {
    this.getTables();
    this.getBranches();
  }

  canCreateTables: boolean = true;
  maxTables: number = -1;

  getTables(): void {
    this.tablesServices.getItemsByInstance().subscribe({
      next: (data) => {
        this.tables = data;
        this.checkLicenseLimit();
      },
      error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
    });
  }

  checkLicenseLimit() {
      // Assuming instance ID is available from one of the services or manually passed 0 to infer from token
      this.dashboardService.getLicenseStatus().subscribe((license: any) => {
          if (license) {
              this.maxTables = license.maxTables === 'Unlimited' ? -1 : parseInt(license.maxTables);
              if (this.maxTables !== -1 && this.tables.length >= this.maxTables) {
                  this.canCreateTables = false;
              } else {
                  this.canCreateTables = true;
              }
          }
      });
  }

  getBranches(): void {
    this.branchesService.getItemsByInstance().subscribe({
      next: (data) => {
        this.branches = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    });
  }

  showModal(isEdit:boolean = false, item?:Table){
    this.isEdit = isEdit;
    if(isEdit)
      this.table = item!;
    else{
      this.table = new Table();
    }
      

    this.visibleModal =  true;
  }

  confirmSave(){
    if(!this.table.branchId){
      this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'Debe seleccionar una sucursal' });
      return;
    }

    if(this.isEdit){
      this.tablesServices.updateItem(this.table!.id!,this.table).subscribe({
        next: (data) => this.getTables(),
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    else{
      this.tablesServices.createItem(this.table).subscribe({
        next: (data) => this.getTables(),
        error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
      });
    }
    this.visibleModal = false;
  }

  confirmDeleted(item:Table) {
    this.confirmationService.confirm({
        header: 'Estas seguro de eliminar?',
        message: 'Por favor de confirmar.',
        accept: () => {
          this.tablesServices.deleteItem(item.id!).subscribe({
            next: (data) => this.getTables(),
            error: (e) => {
              this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
            }
          });
        }
    });
  }

  showQRModal(item:Table){
    this.visibleQRModal = true;
    this.table = item!;
    this.qrData.qrdata = environment.baseUrl+item.identity;
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
      // parentElement contains the base64 encoded image src
      // you might use to store somewhere
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
      link.download = "angularx-qrcode"
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
