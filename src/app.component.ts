import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Ambient Background -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden no-print">
      
      <!-- Noise Texture (Light Film Grain) -->
      <div class="absolute inset-0 bg-noise opacity-[0.035] mix-blend-overlay"></div>

      <!-- Vignette & Fog -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_130%)] opacity-90"></div>
      <div class="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent opacity-95"></div>
      
      <!-- Snow Particles -->
      @for (i of snowParticles; track i) {
        <div class="snowflake" 
             [style.left.%]="random(100)" 
             [style.animation-duration.s]="randomRange(10, 20)" 
             [style.animation-delay.s]="randomRange(0, 10)"
             [style.width.px]="randomRange(2, 4)"
             [style.height.px]="randomRange(2, 4)">
        </div>
      }

      <!-- Trees Silhouette -->
      <div class="absolute bottom-0 left-0 w-64 h-32 opacity-20 text-neutral-800">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" class="w-full h-full fill-current">
          <path d="M10 50 L20 10 L30 50 Z M25 50 L40 20 L55 50 Z M-10 50 L10 20 L30 50 Z" />
        </svg>
      </div>
      <div class="absolute bottom-0 right-0 w-80 h-40 opacity-20 text-neutral-800">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" class="w-full h-full fill-current">
           <path d="M70 50 L80 15 L90 50 Z M50 50 L70 25 L90 50 Z M90 50 L100 30 L110 50 Z" />
        </svg>
      </div>
    </div>

    <div class="relative z-10 flex flex-col min-h-screen">
      <app-navbar />
      <main class="pt-16 flex-grow flex flex-col">
        <router-outlet />
      </main>
      <footer class="py-8 border-t border-neutral-900/50 mt-auto text-center text-neutral-600 text-sm font-light no-print backdrop-blur-sm">
        <p>Academic Project &copy; 2024 AI Resume Analyzer</p>
      </footer>
    </div>
  `
})
export class AppComponent {
  snowParticles = Array(40).fill(0);

  random(max: number) {
    return Math.random() * max;
  }

  randomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
}