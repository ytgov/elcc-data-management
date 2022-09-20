<template>
    <v-row>
        <v-col cols="2">
            <v-btn
                x-small
                dark
                fab
                color="green"
                v-if="status == true"
                class="my-0"
            >
                <v-icon> mdi-check </v-icon>
            </v-btn>
            <v-btn v-else x-small dark fab color="red" class="my-0">
                <v-icon> mdi-close </v-icon>
            </v-btn>
        </v-col>
        <v-col cols="10">
            <span class="text-button">{{ title }} </span>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "healthObject",
    props: {
        title: {
            type: String,
            default: "",
        },
        status: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
