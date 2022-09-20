<template>
    <div class="home">
        <h1>Signing Authorities Home</h1>

        <v-row>
            <v-col
                ><v-card class="mt-5" color="#fff2d5">
                    <v-card-title>Authorities by Employee</v-card-title>
                    <v-card-text>
                        <v-text-field
                            dense
                            outlined
                            background-color="white"
                            label="Search employees"
                            append-icon="mdi-magnify"
                            @click:append="doSearch"
                            @keydown="searchKeyUp"
                            hint="Enter a Name, YNET ID or Employee ID"
                            v-model="search"
                            hide-details
                        ></v-text-field>
<!-- 
                        <v-card-actions class="mt-2">
                            <router-link to="/search"
                                >Advanced search</router-link
                            >
                        </v-card-actions> -->
                    </v-card-text>
                </v-card></v-col
            >
            <v-col>
                <v-card class="mt-5 pb-2" color="#fff2d5">
                    <v-card-title>Authorities by Department</v-card-title>
                    <v-card-text>
                        <v-autocomplete
                            dense
                            outlined
                            background-color="white"
                            :items="departments"
                            item-text="display_name"
                            item-value="dept"
                            hide-details
                            @change="selectDepartment"
                            :search-input.sync="searchTerm"
                            @keyup.enter="shortCutSelectDepartment(searchTerm)"
                        >
                        </v-autocomplete>

                        <!-- <router-link to="/departments">View all</router-link> -->
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!--         <employee-lookup actionName="Authorities" label="" :select="pickPerson"></employee-lookup>
 -->
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
                <v-data-table
                    hide-default-footer
                    :headers="[
                        { text: 'Name', value: 'display_name' },
                        { text: 'YNET Id', value: 'ynet_id' },
                        { text: 'Employee Id', value: 'employee_id' },
                    ]"
                    :items="searchResults"
                    :items-per-page="-1"
                    :loading="loading"
                    @click:row="selectEmployee"
                    class="clickable-row"
                >
                </v-data-table>
            </div>
        </v-navigation-drawer>
        <!-- repalce with a recent work component -->
    </div>
</template>

<script>
//import createEmployeeModal from "@/components/employee/createEmployeeModal.vue";
//import EmployeeLookup from "@/modules/employee/components/employeeLookup.vue";
import { mapActions, mapState } from "vuex";

export default {
    name: "Home",
    //components: { createEmployeeModal, EmployeeLookup },
    data: () => ({
        search: "",
        drawer: null,
        searchResults: [],
        loading: false,
        searchTerm: null,
    }),
    computed: {
        ...mapState("department", ["departments"]),
    },
    methods: {
        ...mapActions("home", ["employeeSearch"]),
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
        selectEmployee(item) {
            this.$router.push(`/employee/${item._id}`);
        },
        shortCutSelectDepartment(searchInput) {
            if (
                this.departments.filter(
                    (department) => department.dept === searchInput
                ).length === 1
            ) {
                this.selectDepartment(searchInput);
            }
        },
        selectDepartment(item) {
            this.$router.push(`/departments/${item}`);
        },
        pickPerson(item) {
            console.log("PICKED", item);

            this.drawer = true;
        },
    },
};
</script>
