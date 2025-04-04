import { Component, inject, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UsersService } from '../../../../core/services/users.service';
import { LinksService } from '../../../../core/services/links.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Link } from '../../interfaces/link.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public userService = inject(UsersService);
  private linksService = inject(LinksService);

  links: Link[] = [];
  filteredLinks: Link[] = [];
  categories = ['Tous', 'Frontend', 'Backend', 'DevOps', 'Mobile'];
  selectedCategory = 'Tous';

  navLinks = [
    { route: '/home', icon: 'home', label: 'Accueil' },
    { route: '/search', icon: 'search', label: 'Rechercher' },
    { route: '/profile', icon: 'person', label: 'Profil' },
    { route: '/settings', icon: 'settings', label: 'Paramètres' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadLinks();
    }
  }

  private loadLinks() {
    if (this.selectedCategory === 'Tous') {
      this.linksService.getLinks().subscribe(links => {
        this.links = links;
        this.filteredLinks = links;
      });
    } else {
      this.linksService.getLinksByCategory(this.selectedCategory).subscribe(links => {
        this.links = links;
        this.filteredLinks = links;
      });
    }
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.loadLinks();
  }
}
