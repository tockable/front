import { fetchProjectMintData } from "@/actions/mintpad/mintpad";
import { TOCKABLE_METADATA } from "@/constants/metadata";
import { IPFS_GATEWAY } from "@/tock.config";
import MintpadLanding from "@/components/mintpad/mintpad-landing";
import NotFound from "@/components/not-found/not-found";

export async function generateMetadata({ params }) {
  const getProject = fetchProjectMintData(params.slug);
  let project = null;
  const res = await getProject;
  if (res.success) {
    project = res.payload;
  }

  if (project) {
    return {
      title: `${project.name} @Tockable`,
      description: project.description,
      applicationNAme: "tockable.xyz",
      keywords: ["nft", "launchpad", "optimism", "tockable", "mint", "mintpad"],
      authors: [{ name: project.twitter }],
      colorSchemte: "dark",
      creator: project.creator,
      themeColor: "#231f20",
      twitter: {
        card: "summary_large_image",
        title: `${project.name} @Tockable`,
        description: project.description,
        creator: project.twitter,
        images: [`${IPFS_GATEWAY}/${project.image}`],
        url: `https://tockable.xyz/c/${project.slug}`,
      },
      openGraph: {
        title: `${project.name} @Tockable`,
        description: project.description,
        url: `https://tockable.xyz/c/${project.slug}`,
        siteName: "Tockable.xyz",
        images: [
          {
            url: `${IPFS_GATEWAY}/${project.cover}`,
            width: 1200,
            height: 300,
          },
        ],
        locale: "en_US",
        type: "website",
      },
    };
  } else {
    return TOCKABLE_METADATA;
  }
}

export default async function Page({ params }) {
  const getProject = fetchProjectMintData(params.slug);
  let project = null;
  const res = await getProject;
  if (res.success) {
    project = res.payload;
  }
  if (project) {
    return <MintpadLanding project={project} />;
  }
  if (!project) {
    return <NotFound />;
  }
}
