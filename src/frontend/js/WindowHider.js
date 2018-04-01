class WindowHider {
    constructor(window, body) {
        this.smallSize = [1000, 60];
        this.bigSize = [1000, 500];

        this.window = window;
        this.body = body;

        this.isVisible = false;
        this.isExpanded = false;

        this.retract();

        setTimeout(() => this.show(), 500);
        // this.hide(false);
    }

    async expand() {
        if (!this.isExpanded) {
            this.isExpanded = true;

            let searchContainer = this.body.querySelector('.search-container');
            searchContainer.style.borderBottomLeftRadius = '0px';
            searchContainer.style.borderBottomRightRadius = '0px';

            this.window.setSize(...this.bigSize);
        }
    }

    async retract() {
        if (this.isExpanded) {
            this.isExpanded = false;

            let searchContainer = this.body.querySelector('.search-container');
            searchContainer.style.borderBottomLeftRadius = 'var(--border-radius)';
            searchContainer.style.borderBottomRightRadius = 'var(--border-radius)';

            this.window.setSize(...this.smallSize);
        }
    }

    async show() {
        this.isVisible = true;
        this.body.style.opacity = "1";
        this.window.setIgnoreMouseEvents(false);
        this.window.focus();
        this.body.querySelector('.search-input').focus();
    }

    async hide(updateSearch = true) {
        this.isVisible = false;
        this.body.style.opacity = "0";
        this.window.setIgnoreMouseEvents(true);
        this.window.blur();
        this.body.querySelector('.search-input').value = '';

        if (updateSearch)
            search('');
    }

    async toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}