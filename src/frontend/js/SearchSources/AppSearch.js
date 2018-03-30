class AppSearch extends SearchSource{
    get name() {
        return 'Apps';
    }

    matches(string) {
        return true;
    }
}