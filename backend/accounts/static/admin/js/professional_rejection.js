document.addEventListener('DOMContentLoaded', function () {
    // Function to update textarea and highlight
    function setupRejectionLogic() {
        document.querySelectorAll('select[name$="-rejection_template"]').forEach(select => {
            select.addEventListener('change', function () {
                const prefix = this.name.replace('rejection_template', '');
                const textarea = document.querySelector(`[name="${prefix}rejection_reason"]`);

                if (textarea && this.value) {
                    if (this.value === 'other') {
                        textarea.value = '';
                        textarea.focus();
                    } else {
                        // Get the text of the selected option
                        const reasonText = this.options[this.selectedIndex].text;
                        textarea.value = reasonText;
                    }
                }
            });
        });

        document.querySelectorAll('select[name$="-verification_status"]').forEach(statusSelect => {
            const updateUI = () => {
                const row = statusSelect.closest('.inline-related');
                if (!row) return;

                const feedbackSection = Array.from(row.querySelectorAll('.module')).find(m =>
                    m.textContent.includes('Verification Feedback')
                );

                if (statusSelect.value === 'rejected') {
                    if (feedbackSection) {
                        feedbackSection.style.borderLeft = '5px solid #d9534f';
                        feedbackSection.style.background = '#fffafa';
                    }
                    statusSelect.style.color = '#d9534f';
                    statusSelect.style.fontWeight = 'bold';
                } else if (statusSelect.value === 'verified') {
                    if (feedbackSection) {
                        feedbackSection.style.borderLeft = '5px solid #5cb85c';
                        feedbackSection.style.background = '#f9fff9';
                    }
                    statusSelect.style.color = '#5cb85c';
                    statusSelect.style.fontWeight = 'bold';
                } else {
                    if (feedbackSection) {
                        feedbackSection.style.borderLeft = '5px solid #f0ad4e';
                        feedbackSection.style.background = '#fffdf5';
                    }
                    statusSelect.style.color = '#f0ad4e';
                    statusSelect.style.fontWeight = 'bold';
                }
            };

            statusSelect.addEventListener('change', updateUI);
            updateUI(); // Initial run
        });
    }

    setupRejectionLogic();

    // Re-run if Django admin adds a new row
    if (typeof django !== 'undefined' && django.jQuery) {
        django.jQuery(document).on('formset:added', function (event, $row, formsetName) {
            setupRejectionLogic();
        });
    }
});
