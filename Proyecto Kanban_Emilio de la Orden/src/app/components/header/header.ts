import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  isDark = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('theme');
      this.isDark = saved === 'dark';
      this.applyTheme();
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    }
    this.applyTheme();
  }

  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
    }
  }
}
