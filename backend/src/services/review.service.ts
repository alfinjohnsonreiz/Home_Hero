import { AppDataSource } from "../db/data-source";
import { Review } from "../entity/Review";
import { serviceGetJobById } from "./job.service";
import { providerProfileRepository } from "./Provider.service";

const reviewRepo = AppDataSource.getRepository(Review);
export const serviceCreateReview = async (
  jobId: any,
  stars: any,
  comment: any
) => {
  try {
    const job = await serviceGetJobById(jobId);
    if (!job) throw new Error("Job not found");

    const homeowner = job.homeownerprofile;
    const provider = job.providerprofile;
    const review = reviewRepo.create({
      stars,
      comment,
      job,
      homeownerprofile: homeowner,
      providerprofile: provider,
    });
    await reviewRepo.save(review);

    // !average rating
    const providerReviews = await reviewRepo.find({
      where: { providerprofile: provider },
    });
     // 3. Calculate average rating
    const totalStars = providerReviews.reduce((sum, r) => sum + r.stars, 0);
    const avgRating = totalStars / providerReviews.length;

    // 4. Update the provider’s average rating
    provider.averageRating = parseFloat(avgRating.toFixed(1));
    await providerProfileRepository.save(provider);

    return review;
  } catch (error) {
    console.error("Error creating Review:", error);
    throw error;
  }
};
