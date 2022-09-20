<template>
    <div>
        <h1>
            Search <small>: {{ searchResults.length }} matches</small>
        </h1>

        <v-row>
            <v-col cols="4">
                <v-text-field
                    label="Search"
                    outlined
                    dense
                    v-model="search"
                    @click:append="doSearch"
                    @keydown="searchKeyUp"
                    persistent-hint
                    hint="Name, Department, Branch, Email"
                ></v-text-field>
            </v-col>
            <v-col cols="4">
                <v-text-field
                    label="Account Code"
                    outlined
                    dense
                    v-model="accountSearch"
                    @click:append="doSearch"
                    @keydown="searchKeyUp"
                ></v-text-field>
            </v-col>
            <!--  <v-col></v-col>
            <v-col
                ><v-btn
                    color="primary"
                    class="float-right"
                    @click="createAuthorityClick"
                    >Create Signing Authority</v-btn
                >
            </v-col> -->
        </v-row>

        <v-data-table
            :items="searchResults"
            :headers="[
                { text: 'Name', value: 'name' },
                { text: 'Title', value: '' },
                { text: 'Department', value: '' },
            ]"
            @click:row="selectAuthority"
            show-expand
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            item-key="student_id"
        >
        </v-data-table>
    </div>
</template>

<script>
// import axios from "axios";
// import { STUDENT_URL, STUDENT_SEARCH_URL } from "../urls";
// import CreateStudentDialog from '../components/CreateAuthorityDialog.vue';

export default {
    //components: { CreateSigningAuthority },
    data: () => ({
        search: "",
        accountSearch: "",
        searchResults: [],
        selectedAuthority: {},
        signingAuthorities: [],
        showDrawer: false,
        expanded: [],
        singleExpand: true,
    }),
    created() {
        if (this.$route.query && this.$route.query.text) {
            this.search = this.$route.query.text;
            this.doSearch();
        }
    },
    methods: {
        searchKeyUp(event) {
            if (event.key == "Enter") this.doSearch();
        },
        doSearch() {
            this.selectedAuthority = null;
            this.signingAuthorities = [];

            let cleanSearch = this.search.trim().toLowerCase();
            if (cleanSearch.length == 0) return;
            // **** TODO ****
            // Stub out search logic

            // axios
            //   .post(`${STUDENT_SEARCH_URL}`, { terms: cleanSearch })
            //   .then((resp) => {
            //     this.searchResults = resp.data.data;
            //     this.resultCount = resp.data.meta.item_count;
            //   })
            //   .catch((err) => {
            //     this.$emit("showError", err);
            //   });
        },
        selectAuthority(item) {
            this.selectedAuthority = item;

            // axios
            // .get(`${STUDENT_URL}/${item.student_id}/applications`)
            // .then((resp) => {
            //   this.studentApplications = resp.data.data;
            //   this.showDrawer = true;
            // })
            // .catch((err) => console.log(err));
        },
        createAuthorityClick() {
            this.$refs.createAuthorityDialog.show();
        },

        createAuthority() {
            console.log("CREATEING STUDENT");

            // let body = {};

            // axios.post(`${STUDENT_URL}`, body).then((resp) => {
            //   console.log(resp.data);
            // });
        },

        createApplication() {
            console.log("CREATEING App for " + this.selectedStudent.student_id);
        },
    },
};
</script>