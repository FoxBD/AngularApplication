import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-translations',
  templateUrl: './translations.component.html',
  styleUrl: './translations.component.scss'
})
export class TranslationsComponent {
  constructor(private translate: TranslateService) { this.translate.setDefaultLang('en'); }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}
