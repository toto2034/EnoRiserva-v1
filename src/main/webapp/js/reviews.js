// Recensioni fittizie coerenti per tutti i prodotti

class ReviewsManager {
    constructor() {
        this.reviewsData = this.generateBaseReviews();
        this.userNames = [
            "Marco R.", "Anna M.", "Giuseppe L.", "Laura B.", "Francesco T.", 
            "Giulia P.", "Davide S.", "Chiara F.", "Alessandro C.", "Martina G.",
            "Roberto V.", "Valentina L.", "Matteo R.", "Federica N.", "Luca D.",
            "Silvia M.", "Andrea K.", "Paola H.", "Simone B.", "Elena W."
        ];
    }

    // Genera recensioni base per ogni prodotto
    generateBaseReviews() {
        const reviewTemplates = [
            {
                text: "Vino fantastico! La qualità è eccezionale e l'equilibrio al palato è davvero notevole. Lo consiglio vivamente.",
                sentiment: "positive"
            },
            {
                text: "Molto soddisfatto dell'acquisto. Ottimo rapporto qualità-prezzo, anche se la consegna è stata un po' lenta, ma ne è valsa la pena.",
                sentiment: "positive"
            },
            {
                text: "Eccellente! Esattamente come descritto nella scheda. Un vino di grande struttura e complessità, con un'etichetta molto elegante.",
                sentiment: "positive"
            },
            {
                text: "Un vino nella media. Piacevole da bere ma senza particolari picchi di eccellenza. Il prezzo è corretto per la qualità offerta.",
                sentiment: "neutral"
            },
            {
                text: "Buona qualità generale, anche se l'ho trovato un po' sbilanciato sull'acidità. Nel complesso una bottiglia interessante.",
                sentiment: "neutral"
            },
            {
                text: "Ottima bottiglia! Ha superato le mie aspettative. Incredibilmente piacevole al palato, con una complessità di aromi evidente fin dal primo sorso.",
                sentiment: "positive"
            },
            {
                text: "Vino discreto, ma mi aspettavo qualcosa di più data la denominazione. Si lascia bere, ma non lascia il segno come speravo.",
                sentiment: "neutral"
            },
            {
                text: "Fantastico! Una delle migliori etichette che abbia assaggiato quest'anno. Un'esperienza di degustazione straordinaria, qualità premium evidente.",
                sentiment: "positive"
            },
            {
                text: "Buon vino, ma l'imballaggio era un po' rovinato. La bottiglia in sé, per fortuna, era integra e all'altezza delle aspettative.",
                sentiment: "neutral"
            },
            {
                text: "Qualità eccellente e un'eleganza al palato impareggiabile. Vale ogni euro speso. Consigliatissimo agli amanti del buon vino!",
                sentiment: "positive"
            }
        ];

        return reviewTemplates;
    }

    // Genera rating coerente basato su ID prodotto
    generateProductRating(productId) {
        // Usa l'ID del prodotto per generare un rating consistente
        const seed = productId * 17 + 42; // Formula per consistenza
        const variance = (seed % 10) / 10; // Variazione 0-0.9
        
        // Rating base tra 3.5 e 5.0
        const baseRating = 3.5 + (variance * 1.5);
        return Math.round(baseRating * 10) / 10; // Arrotonda a 1 decimale
    }

    // Genera numero di recensioni coerente
    generateReviewCount(productId) {
        const seed = productId * 23 + 7;
        return Math.floor((seed % 80) + 15); // Tra 15 e 94 recensioni
    }

    // Genera distribuzione stelle coerente
    generateStarsDistribution(productId, totalReviews) {
        const rating = this.generateProductRating(productId);
        
        // Calcola distribuzione basata sul rating medio
        const distribution = [0, 0, 0, 0, 0]; // 1-5 stelle
        
        if (rating >= 4.5) {
            distribution[4] = Math.floor(totalReviews * 0.70); // 5 stelle: 70%
            distribution[3] = Math.floor(totalReviews * 0.20); // 4 stelle: 20%
            distribution[2] = Math.floor(totalReviews * 0.07); // 3 stelle: 7%
            distribution[1] = Math.floor(totalReviews * 0.02); // 2 stelle: 2%
            distribution[0] = Math.floor(totalReviews * 0.01); // 1 stella: 1%
        } else if (rating >= 4.0) {
            distribution[4] = Math.floor(totalReviews * 0.55);
            distribution[3] = Math.floor(totalReviews * 0.30);
            distribution[2] = Math.floor(totalReviews * 0.10);
            distribution[1] = Math.floor(totalReviews * 0.04);
            distribution[0] = Math.floor(totalReviews * 0.01);
        } else if (rating >= 3.5) {
            distribution[4] = Math.floor(totalReviews * 0.40);
            distribution[3] = Math.floor(totalReviews * 0.35);
            distribution[2] = Math.floor(totalReviews * 0.15);
            distribution[1] = Math.floor(totalReviews * 0.08);
            distribution[0] = Math.floor(totalReviews * 0.02);
        }
        
        // Aggiusta per raggiungere il totale esatto
        const sum = distribution.reduce((a, b) => a + b, 0);
        if (sum < totalReviews) {
            distribution[4] += (totalReviews - sum);
        }
        
        return distribution;
    }

    // Genera recensioni specifiche per un prodotto
    generateProductReviews(productId, limit = 5) {
        const reviews = [];
        const totalReviews = this.generateReviewCount(productId);
        const rating = this.generateProductRating(productId);
        
        for (let i = 0; i < limit; i++) {
            const reviewIndex = (productId + i) % this.reviewsData.length;
            const nameIndex = (productId * 3 + i * 7) % this.userNames.length;
            
            // Genera rating individuale coerente con quello medio
            let individualRating;
            if (rating >= 4.5) {
                individualRating = Math.random() < 0.8 ? 5 : 4;
            } else if (rating >= 4.0) {
                individualRating = Math.random() < 0.6 ? 5 : Math.random() < 0.8 ? 4 : 3;
            } else {
                individualRating = Math.random() < 0.4 ? 5 : Math.random() < 0.7 ? 4 : 3;
            }
            
            const daysAgo = Math.floor(Math.random() * 90) + 1;
            const reviewDate = new Date();
            reviewDate.setDate(reviewDate.getDate() - daysAgo);
            
            reviews.push({
                id: `${productId}-${i}`,
                name: this.userNames[nameIndex],
                rating: individualRating,
                date: this.formatDate(reviewDate),
                text: this.reviewsData[reviewIndex].text,
                verified: Math.random() < 0.7, // 70% verificate
                helpful: Math.floor(Math.random() * 15) + 1
            });
        }
        
        return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Ottieni dati completi recensioni per un prodotto
    getProductReviewData(productId) {
        const totalReviews = this.generateReviewCount(productId);
        const rating = this.generateProductRating(productId);
        const distribution = this.generateStarsDistribution(productId, totalReviews);
        const reviews = this.generateProductReviews(productId);
        
        return {
            totalReviews,
            averageRating: rating,
            starsDistribution: distribution,
            reviews: reviews,
            formattedRating: this.formatRating(rating),
            starsHtml: this.generateStarsHtml(rating)
        };
    }

    // Genera stelle HTML per rating
    generateStarsHtml(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let html = '';
        for (let i = 0; i < fullStars; i++) {
            html += '★';
        }
        if (hasHalfStar) {
            html += '☆'; // Puoi usare un'icona di mezza stella se disponibile
        }
        for (let i = 0; i < emptyStars; i++) {
            html += '☆';
        }
        
        return html;
    }

    // Formatta rating
    formatRating(rating) {
        return rating.toFixed(1);
    }

    // Formatta data
    formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('it-IT', options);
    }

    // Genera HTML per barre rating
    generateRatingBarsHtml(distribution, totalReviews) {
        let html = '<div class="rating-bar-container">';
        
        for (let i = 4; i >= 0; i--) {
            const stars = i + 1;
            const count = distribution[i];
            const percentage = totalReviews > 0 ? (count / totalReviews * 100) : 0;
            
            html += `
                <div class="rating-bar-row">
                    <span class="rating-bar-label">${stars}★</span>
                    <div class="rating-bar-track">
                        <div class="rating-bar-fill" style="width: ${percentage}%;"></div>
                    </div>
                    <span class="rating-bar-count">${count}</span>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }

    // Genera HTML per lista recensioni
    generateReviewsListHtml(reviews) {
        return reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div>
                        <div class="reviewer-info">
                            ${review.name} ${review.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Acquisto verificato</span>' : ''}
                        </div>
                        <div class="review-rating">
                            ${this.generateStarsHtml(review.rating)}
                        </div>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <p class="review-text">${review.text}</p>
                <div class="review-actions">
                    <button class="review-action-btn useful">
                        <i class="fas fa-thumbs-up"></i> Utile (${review.helpful})
                    </button>
                    <button class="review-action-btn reply">
                        <i class="fas fa-reply"></i> Rispondi
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Istanza globale del manager recensioni
const reviewsManager = new ReviewsManager();

// Funzioni di utilità per compatibilità con codice esistente
function generateRatingBars(productId) {
    const data = reviewsManager.getProductReviewData(productId);
    return reviewsManager.generateRatingBarsHtml(data.starsDistribution, data.totalReviews);
}

function generateReviews(productId) {
    const data = reviewsManager.getProductReviewData(productId);
    return reviewsManager.generateReviewsListHtml(data.reviews);
}

function getProductRating(productId) {
    return reviewsManager.generateProductRating(productId);
}

function getProductReviewCount(productId) {
    return reviewsManager.generateReviewCount(productId);
}

function getProductStarsHtml(productId) {
    const rating = reviewsManager.generateProductRating(productId);
    return reviewsManager.generateStarsHtml(rating);
}