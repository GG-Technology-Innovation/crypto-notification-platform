import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, BadgeModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(private router: Router) {
    this.router.routeReuseStrategy;
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
          this.router.navigate(['/home']);
        },
      },
      // {
      //   label: 'Features',
      //   icon: 'pi pi-star',
      // },
      // {
      //   label: 'Projects',
      //   icon: 'pi pi-search',
      //   items: [
      //     {
      //       label: 'Components',
      //       icon: 'pi pi-bolt',
      //     },
      //     {
      //       label: 'Blocks',
      //       icon: 'pi pi-server',
      //     },
      //     {
      //       label: 'UI Kit',
      //       icon: 'pi pi-pencil',
      //     },
      //     {
      //       label: 'Templates',
      //       icon: 'pi pi-palette',
      //       items: [
      //         {
      //           label: 'Apollo',
      //           icon: 'pi pi-palette',
      //         },
      //         {
      //           label: 'Ultima',
      //           icon: 'pi pi-palette',
      //         },
      //       ],
      //     },
      //   ],
      // },
    ];
  }
}
