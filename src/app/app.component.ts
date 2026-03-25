import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Scammer {
  name: string;
  tag: string;
  detail?: string;
  letter: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  allScammers: Scammer[] = [];
  filteredScammers: Scammer[] = [];
  displayedScammers: Scammer[] = [];
  expandedIndex: number | null = null;
  showHelp = false;
  searchQuery = '';
  filterTag = 'all';
  filterLetter = 'all';

  letters: string[] = [];

  stats = { total: 0, scammer: 0, warning: 0 };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.http.get<Record<string, { name: string; tag: string; detail?: string }[]>>('scammer_list.json', { headers: { 'Cache-Control': 'no-store' } })
      .subscribe({
        next: (data) => {
          this.processData(data);
        },
        error: () => {
          console.error('Failed to load scammer list');
        }
      });
  }

  processData(data: Record<string, { name: string; tag: string; detail?: string }[]>) {
    const result: Scammer[] = [];
    const letterSet = new Set<string>();

    for (const letter of Object.keys(data)) {
      letterSet.add(letter);
      for (const item of data[letter]) {
        result.push({ ...item, letter });
      }
    }

    this.allScammers = result;
    this.letters = Array.from(letterSet).sort();
    this.computeStats();
    this.applyFilters();
  }

  computeStats() {
    this.stats.total = this.allScammers.length;
    this.stats.scammer = this.allScammers.filter(s => s.tag === 'S').length;
    this.stats.warning = this.allScammers.filter(s => s.tag === 'W').length;
  }

  applyFilters() {
    let result = [...this.allScammers];

    if (this.filterTag !== 'all') {
      result = result.filter(s => s.tag === this.filterTag);
    }

    if (this.filterLetter !== 'all') {
      result = result.filter(s => s.letter === this.filterLetter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.detail ?? '').toLowerCase().includes(q)
      );
    }

    this.filteredScammers = result;
    this.expandedIndex = null;
  }

  toggleExpand(i: number) {
    this.expandedIndex = this.expandedIndex === i ? null : i;
  }

  getTagLabel(tag: string): string {
    return tag === 'W' ? 'Waspada' : 'Scammer';
  }

  getTagClass(tag: string): string {
    return tag === 'W' ? 'warn' : 'scam';
  }

  onSearch() {
    this.applyFilters();
  }

  clearSearch() {
    this.searchQuery = '';
    this.applyFilters();
  }

  refresh() {
    this.searchQuery = '';
    this.filterTag = 'all';
    this.filterLetter = 'all';
    this.loadData();
  }
}
