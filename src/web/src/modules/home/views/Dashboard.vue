<template>
    <div class="home">
        <h1>Dashboard</h1>

        <v-row>
            <v-col
                ><v-card class="mt-5" color="#fff2d5">
                    <v-card-title>Centres</v-card-title>
                    <v-card-text>
                
                    </v-card-text>
                </v-card></v-col
            >
            <v-col>
                
            </v-col>
        </v-row>

        <v-navigation-drawer
            v-model="drawer"
            absolute
            right
            temporary
            width="600"
            loading
        >
            <v-list-item loading>
                <v-list-item-content>
                    <v-list-item-title>
                        <div class="float-right">
                            <v-btn
                                x-small
                                color="primary"
                                text
                                :to="'/search?text=' + search"
                                class="my-0"
                                style="font-size: 12px !important"
                            >
                                Advanced search</v-btn
                            >
                        </div>
                        <div class="float-left">
                            Employees ({{ searchResults.length }} matches)
                        </div>
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <div style="max-height: 400px; overflow-y: scroll">
            </div>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    name: "Home",
    data: () => ({
        search: "",
        drawer: null,
        searchResults: [],
        loading: false,
        searchTerm: null,
    }),
    computed: {
    },
    methods: {
        
        searchKeyUp(event) {
            if (event.key == "Enter") this.doSearch();
        },
        async doSearch() {
            let cleanSearch = this.search.trim().toLowerCase();
            if (cleanSearch.length == 0) return;

            this.loading = true;

            await this.employeeSearch({ term: cleanSearch })
                .then((resp) => {
                    this.searchResults = resp.data.data;
                    this.drawer = true;
                    this.resultCount = resp.data.meta.item_count;
                })
                .catch((err) => {
                    this.$emit("showError", err);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
};
</script>
