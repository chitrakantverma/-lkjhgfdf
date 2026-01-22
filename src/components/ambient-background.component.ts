import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ambient-background',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="absolute inset-0 overflow-hidden pointer-events-none select-none z-[-1]">
      
      <!-- Snow Particles -->
      @for (s of snow; track s.id) {
        <div class="absolute bg-white rounded-full opacity-[0.08]"
             [style.left.%]="s.left"
             [style.top.%]="-10"
             [style.width.px]="s.size"
             [style.height.px]="s.size"
             [style.animation]="'snow-fall ' + s.duration + 's linear infinite'"
             [style.animation-delay]="s.delay + 's'">
        </div>
      }

      <!-- Falling Leaves -->
      @for (l of leaves; track l.id) {
        <div class="absolute text-neutral-600 opacity-[0.15]"
             [style.left.%]="l.left"
             [style.top.%]="-10"
             [style.animation]="'leaf-fall ' + l.duration + 's ease-in-out infinite'"
             [style.animation-delay]="l.delay + 's'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" [style.transform]="'rotate(' + l.rotation + 'deg)'">
            <path d="M12 2C12 2 13 8 18 10C23 12 12 22 12 22C12 22 1 12 6 10C11 8 12 2 12 2Z" />
          </svg>
        </div>
      }

      <!-- Bottom Environment Trees -->
      <div class="absolute bottom-0 left-0 w-48 h-24 md:w-80 md:h-40 opacity-20 text-neutral-800">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" class="w-full h-full fill-current">
          <path d="M10 50 L25 15 L40 50 Z M30 50 L45 25 L60 50 Z M-10 50 L10 20 L30 50 Z" />
        </svg>
      </div>
      
      <div class="absolute bottom-0 right-0 w-56 h-28 md:w-96 md:h-48 opacity-20 text-neutral-800">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" class="w-full h-full fill-current">
           <path d="M70 50 L85 10 L100 50 Z M50 50 L70 20 L90 50 Z M90 50 L105 30 L120 50 Z" />
        </svg>
      </div>

    </div>
  `,
  styles: [`
    @keyframes snow-fall {
      0% { transform: translateY(0); }
      100% { transform: translateY(110vh); }
    }
    @keyframes leaf-fall {
      0% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(20px, 30vh) rotate(45deg); }
      50% { transform: translate(-15px, 60vh) rotate(90deg); }
      75% { transform: translate(10px, 85vh) rotate(135deg); }
      100% { transform: translate(0, 110vh) rotate(180deg); }
    }
  `]
})
export class AmbientBackgroundComponent {
  snow = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 2 + 1, // 1-3px
    duration: Math.random() * 15 + 10, // 10-25s
    delay: Math.random() * -20 // Start instantly randomly
  }));

  leaves = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    rotation: Math.random() * 360,
    duration: Math.random() * 10 + 15, // 15-25s
    delay: Math.random() * -20
  }));
}