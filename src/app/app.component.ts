import { Component } from "@angular/core";
import PSPDFKit from "pspdfkit";
import { RouterOutlet } from '@angular/router';
import { AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  constructor(
    private cookieService: CookieService
  ) {

  }
	title = "PSPDFKit for Web Angular Example";
  public pdfInstance: any;

	async ngAfterViewInit() {

		PSPDFKit.load({
			// Use the assets directory URL as a base URL. PSPDFKit will download its library assets from here.
			baseUrl: location.protocol + "//" + location.host + "/assets/",
			//document: `data:application/pdf;base64,${base64EncodedDocument}`,
			document: './assets/Document.pdf',
			container: "#pspdfkit-container",
			//container: 'pspdfkit-container',
      licenseKey: "wEsCXWQ_-SOAChKr4vn1wSbDYQwM4PalzA_tqZJD2_enk81g6U0_s_gRX9U8Hs5Ra7Iyxm9ElAsIn514qiFXCJaxVf7BkcUQRCn498adZOf5YL5zeV0jkl6w1kgOVRoyb7oVefIUwnxFdY51cDRAoy-lOFaEP6s5W6jGaTvXGSgoNxnMTCFk5KYtFSMcgHwzdJI8er5yk0-d5QE",
      //toolbarItems: [
      //  {
      //    type: "form-creator"
      //  }
      //]
		}).then(async instance => {      
      // Obtener firmas existentes - db
      //const signatureFormFields = [
      //  this.createSignatureFormField(instance, 0, 100, 100, 200, 50, "Signature Field 1"),
      //  this.createSignatureFormField(instance, 0, 300, 300, 200, 50, "Signature Field 2"),
      //  this.createSignatureFormField(instance, 0, 500, 500, 200, 50, "Signature Field 3"),
      //];
      //// Agregar firmas existentes
      //Promise.all(signatureFormFields).then(() => {
      //  console.log("All signature fields have been added.");
      //});


      //const firmas = await JSON.parse(this.cookieService.get('firmas'));
      //console.log("Firmas *********************** => ", firmas);
      //instance.applyOperations(firmas);
//
      const data = JSON.parse(localStorage.getItem('firmas') || 'null');

      console.log("PSPDFKit - Signated =>", instance);
      
      await instance.applyOperations([
        { type: "applyInstantJson", instantJson: data }
      ]);
      // igualar instancia
      this.pdfInstance = await instance;
      //const formFieldValues = instance.getFormFieldValues();
		});

	}

  /**
   * 
   * @param instance 
   * @param pageIndex 
   * @param left 
   * @param top 
   * @param width 
   * @param height 
   * @param name 
   * @returns 
   */
  createSignatureFormField(instance:any, pageIndex:any, left:any, top:any, width:any, height:any, name:any) {
    const widget = new PSPDFKit.Annotations.WidgetAnnotation({
    pageIndex: pageIndex,
    boundingBox: new PSPDFKit.Geometry.Rect({
      left: left,
      top: top,
      width: width,
      height: height
    }),
    formFieldName: name,
    id: PSPDFKit.generateInstantId()
  });

  const formField = new PSPDFKit.FormFields.SignatureFormField({
    name: name,
    annotationIds: PSPDFKit.Immutable.List([widget.id])
  });

  return instance.create([widget, formField]);
  }

  async getInstances() {
    
    const formFieldValues = this.pdfInstance.getFormFieldValues();
    //console.log("Form Field Values => ", formFieldValues);
    //const annotations = await this.pdfInstance.getAnnotations(0);
    //console.log("Annotations => ", annotations);
    await this.pdfInstance.save();
    const firmas = await this.pdfInstance.exportInstantJSON();
    
    console.log("Firmas => Antes de setear a la cookie ", firmas);
    let formattedFirmas = JSON.stringify(firmas);
    console.log("Firmas => Formateadas ", formattedFirmas);
    //localStorage.setItem('firmas', formattedFirmas);

    //const data = new Blob([formattedFirmas], { type: 'text/plain;charset=utf-8' });
    //saveAs(data, 'anotations.json');

  }

  exportToPDF() {
    console.log("*********************************** Exporting PDF");
    this.pdfInstance.exportPDF().then((pdf:any) => {
      console.log("PDF => ", pdf);
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const documentSign = document.createElement('a');
      documentSign.href = url;
      documentSign.download = 'document.pdf';
      documentSign.click();
    });
  }

  async getAnnotations() {
    const firmas = await JSON.parse(this.cookieService.get('firmas'));
    console.log("Firmas *********************** => ", firmas);
  }

}