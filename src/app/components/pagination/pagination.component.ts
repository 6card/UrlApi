import { Component, Input, Output, OnInit, EventEmitter, OnChanges  } from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    // host: { '[class.pagination]': 'true' },
})

export class PaginationComponent implements OnInit, OnChanges {
    @Input() page: number = 1;
    @Input() totalItems: number = 100;
    @Input() itemsPerPage: number = 10;

    @Output() goToPage = new EventEmitter();

    private totalPages: number;
    public directionLinks: boolean = true;
    public boundaryLinks: boolean = true;
    private rotate: boolean = false;
    private maxSize: number = 5;

    public pages: Array<any>;

    ngOnInit() {
        this.totalPages = this.calculateTotalPages();
        this.pages = this.getPages(this.page, this.totalPages);
    }

    ngOnChanges(changes: any) {
        this.totalPages = this.calculateTotalPages();
        this.pages = this.getPages(this.page, this.totalPages);
    }

    private makePage(number: number, text: string, isActive: boolean): {number: number, text: string, active: boolean} {
        return {
            number: number,
            text: text,
            active: isActive
        };
    }

    private getPages(currentPage: number, totalPages: number): Array<any> {
        const pages: any[] = [];

        // Default page limits
        let startPage = 1;
        let endPage = totalPages;
        const isMaxSized = typeof this.maxSize !== 'undefined' && this.maxSize < totalPages;

        // recompute if maxSize
        if (isMaxSized) {
            if (this.rotate) {
                // Current page is displayed in the middle of the visible ones
                startPage = Math.max(currentPage - Math.floor(this.maxSize / 2), 1);
                endPage = startPage + this.maxSize - 1;

                // Adjust if limit is exceeded
                if (endPage > totalPages) {
                    endPage = totalPages;
                    startPage = endPage - this.maxSize + 1;
                }
            } else {
                // Visible pages are paginated with maxSize
                startPage = ((Math.ceil(currentPage / this.maxSize) - 1) * this.maxSize) + 1;

                // Adjust last page if limit is exceeded
                endPage = Math.min(startPage + this.maxSize - 1, totalPages);
            }
        }

        // Add page number links
        for (let number = startPage; number <= endPage; number++) {
            const page = this.makePage(number, number.toString(), number === +currentPage);
            pages.push(page);
        }

        // Add links to move between page sets
        if (isMaxSized && !this.rotate) {
            if (startPage > 1) {
                const previousPageSet = this.makePage(startPage - 1, '...', false);
                pages.unshift(previousPageSet);
            }

            if (endPage < totalPages) {
                const nextPageSet = this.makePage(endPage + 1, '...', false);
                pages.push(nextPageSet);
            }
        }
        return pages;
    }

    private selectPage(page: number, event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }

        if (event && event.target) {
            const target: any = event.target;
            target.blur();
        }
        this.writeValue(page);
        this.goToPage.emit(this.page);
    }

    writeValue(value: number) {
        this.page = value;
        this.pages = this.getPages(this.page, this.totalPages);
    }

    private calculateTotalPages(): number {
        const totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil(this.totalItems / this.itemsPerPage);
        // console.log(this.totalItems + ' ' + this.itemsPerPage)
        return Math.max(totalPages || 0, 1);
    }

    private noNext(): boolean {
        return this.page === this.totalPages;
    }

    private noPrevious(): boolean {
        return this.page === 1;
    }

    public get firstItem(): number {
        return (this.page - 1) * this.itemsPerPage;
    }

    public get lastItem(): number {
        const res = this.page * this.itemsPerPage - 1;
        return  res > this.totalItems ? this.totalItems - 1 : res;
    }

}
