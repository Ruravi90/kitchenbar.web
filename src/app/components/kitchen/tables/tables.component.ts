import { Component } from '@angular/core';
import { Table } from '../../../models';
import { HubInterface, TablesInterface } from '../../../interfaces';
import { MessageService } from 'primeng/api';
import { QRCodeElementType, QRCodeErrorCorrectionLevel } from 'angularx-qrcode';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss',
  providers: [MessageService]
})
export class TablesComponent {

  constructor(
    private messageService: MessageService,
    private tableServices: TablesInterface,
    private hub: HubInterface,
    private router: Router){
      this.elementType= "canvas" as QRCodeElementType;
    }

  tables?: Table[];
  table?:Table;
  isBusyTableService: boolean = false;
  visibleQRModal:boolean = false;
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
    this.retrieveTables();
    this.hub.notificationWarnTables().subscribe(x =>  {
      if(x.isRequestAttendace)
        this.messageService.add({ summary: 'Asistencia', detail: `La ${x.name} necesita ayuda`, life: 3000 });
      if(x.isRequestCheck)
        this.messageService.add({ summary: 'Cuenta', detail: `La ${x.name} solicito la cuenta`, life: 3000 });
      this.retrieveTables();
    });

    this.hub.notificationDangerTables().subscribe(x =>  {
      console.log("notificationWarnAttendace", x);
      this.messageService.add({ summary: 'Asistencia', detail: 'Se solicito asistencia', life: 3000 });
      this.retrieveTables();
    });
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  requestAttendace(item:Table){
    item.isRequestAttendace =false;
    this.tableServices.request(item).subscribe({
      next:()=>{
        this.hub.sendNotificationTables(item);
        this.router.navigate(["/kitchen/table/"+item.identity]);
      },
      error: (e) => {
        console.log(e);
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    });
  }
  requestCheck(item:Table){
    item.isRequestCheck = false;
    this.tableServices.request(item).subscribe({
      next:()=>{
        this.hub.sendNotificationTables(item);
        this.router.navigate(["/kitchen/table/"+item.identity]);
      },
      error: (e) => {
        console.log(e);
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
      }
    });
  }


  retrieveTables(): void {
    if(this.isBusyTableService)
      return;

    this.isBusyTableService = true;
    this.tableServices.getItemsByInstance().subscribe({
      next: (data) => {
        this.isBusyTableService = false;
        this.tables = data;
      },
      error: (e) => {
        this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: e.error.messages });
        this.isBusyTableService = false;
      }
    });
  }

  showQRModal(item:Table){
    this.visibleQRModal = true;
    this.table = item!;
    this.qrData.qrdata = environment.baseUrl+item.identity;
  }
}
