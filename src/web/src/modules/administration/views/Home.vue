<template>
    <v-container fluid class="down-top-padding">
        <BaseBreadcrumb
            :title="page.title"
            :icon="page.icon"
            :breadcrumbs="breadcrumbs"
        >
            <template v-slot:right>
                <!-- <timed-message ref="messager" class="mr-4"></timed-message> -->
            </template>
        </BaseBreadcrumb>

        <BaseCard>
            <v-row>
                <v-col cols="4">
                    <v-card class="default">
                        <v-card-text>
                            <router-link to="/administration/users"
                                >Manage users</router-link
                            >
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card class="my-0 default">
                        <healthCheck></healthCheck>
                    </v-card>
                </v-col>
                <v-col>
                    <v-card class="my-0 default">
                        <seed-data></seed-data>
                        <!-- Seed Data -->
                    </v-card>
                </v-col>
            </v-row>
        </BaseCard>
        <notifications ref="notifier"></notifications>
    </v-container>
</template>

<script>
import healthCheck from "../components/health/healthCheck.vue";
import SeedData from "../components/seed/seedData.vue";

export default {
    name: "Home",
    components: {
        healthCheck,
        SeedData,
    },
    data: () => ({
        page: { title: "Administration" },
        breadcrumbs: [{ text: "Administration" }],
    }),
    mounted() {},
    computed: {},
    methods: {},
};
</script>
