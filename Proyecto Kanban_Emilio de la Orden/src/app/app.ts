import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Sidebar } from "./components/sidebar/sidebar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('proyecto-kanban');
}
