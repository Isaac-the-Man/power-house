export default {
    methods: {
        arrayEquals(a, b) {
            return Array.isArray(a) &&
                Array.isArray(b) &&
                a.length === b.length &&
                a.every((val, index) => val === b[index]);
        },
        mergeKey(obj) {
            // merge objects of objects to array of objects with keys
            const formatted = [];
            if (obj) {
                for (let key of Object.keys(obj)) {
                    formatted.push({
                        ...obj[key],
                        key: key
                    });
                }
            }
            return formatted;
        },
        makeToast(title, content, variant = null) {
            this.$bvToast.toast(content, {
                title: title,
                variant: variant,
                solid: true
            });
        },
        confirmModal(msg) {
            return this.$bvModal.msgBoxConfirm(msg, {
                title: 'Confirm Action',
                okVariant: 'success',
                cancelVariant: 'danger'
            });
        },
        clone(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    }
}