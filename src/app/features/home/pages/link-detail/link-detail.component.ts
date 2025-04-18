import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LinksService } from '../../../../core/services/links.service';
import { UsersService } from '../../../../core/services/users.service';
import { Link } from '../../interfaces/link.interface';
import { NavBarComponent } from '../../../../core/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-link-detail',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './link-detail.component.html',
  styleUrls: ['./link-detail.component.css']
})
export class LinkDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private linksService = inject(LinksService);
  protected userService = inject(UsersService);

  link: Link | null = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.linksService.getLinkById(id).subscribe(link => {
          this.link = link;
        });
      }
    });
  }
} 