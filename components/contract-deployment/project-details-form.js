"use client";
import { useContext, useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useAccount } from "wagmi";
import { IPFS_GATEWAY } from "@/tock.config";
import { regex } from "@/constants/regex";
import { projectImageFileTypes } from "@/constants/constants";
import { updateProjectDetails } from "@/api/projects/projects";
import { arrayBufferToBase64 } from "@/utils/utils";
import { extractSlug } from "@/utils/string-utils";
import { LaunchpadContext } from "@/contexts/project-context";
import LabeledInput from "../design/labeled-input/labeled-input";
import Button from "../design/button/button";

export default function ProjectDetailsForm() {
  // Contexts
  const { project, setProject } = useContext(LaunchpadContext);
  const { address } = useAccount();
  // Page states
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showImage, setShowImage] = useState(false);
  const [imageToShow, setImageToShow] = useState();
  const [imageChanged, setImageChanged] = useState(false);
  const [imageSizeError, setImageSizeError] = useState(false);
  const [imageTypeError, setImageTypeError] = useState(false);

  const [showCover, setShowCover] = useState(false);
  const [coverToShow, setCoverToShow] = useState();
  const [coverChanged, setCoverChanged] = useState(false);
  const [coverSizeError, setCoverSizeError] = useState(false);
  const [coverTypeError, setCoverTypeError] = useState(false);
  // Form states
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [website, setWebsite] = useState(project.website);
  const [twitter, setTwitter] = useState(project.twitter);
  const [discord, setDiscord] = useState(project.discord);
  const [image, setImage] = useState(null);
  const [cover, setCover] = useState(null);
  const [slug, setSlug] = useState(project.slug);

  useEffect(() => {
    if (project.image) {
      setImageToShow(`${IPFS_GATEWAY}/${project.image}`);
      if (!showImage) {
        setShowImage(true);
      }
    }
  }, []);

  useEffect(() => {
    if (project.cover) {
      setCoverToShow(`${IPFS_GATEWAY}/${project.cover}`);
      if (!showCover) {
        setShowCover(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!image) return;
    if (imageTypeError) setImageTypeError(false);
    if (imageSizeError) setImageSizeError(false);
    image.arrayBuffer().then((res) => {
      const base64image = arrayBufferToBase64(res, image);
      setImageToShow(base64image);
      if (!showImage) {
        setShowImage(true);
      }
    });
  }, [image]);

  useEffect(() => {
    if (!cover) return;
    if (coverTypeError) setCoverTypeError(false);
    if (coverSizeError) setCoverSizeError(false);
    cover.arrayBuffer().then((res) => {
      const base64image = arrayBufferToBase64(res, cover);
      setCoverToShow(base64image);
      if (!showCover) {
        setShowCover(true);
      }
    });
  }, [cover]);

  function noSubmit(e) {
    e.key === "Enter" && e.preventDefault();
  }

  function clearImage() {
    if (!image && !imageToShow) return;
    if (imageTypeError) setImageTypeError(false);
    if (imageSizeError) setImageSizeError(false);
    setImageToShow(null);
    setShowImage(false);
    setImage(null);
    setImageChanged(true);
  }

  function clearCover() {
    if (!cover && !coverToShow) return;
    if (coverTypeError) setCoverTypeError(false);
    if (coverSizeError) setCoverSizeError(false);
    setCoverToShow(null);
    setShowCover(false);
    setCover(null);
    setCoverChanged(true);
  }

  function updateNeeded() {
    if (
      project.name != name ||
      project.description != description ||
      project.website != website ||
      project.twitter != twitter ||
      project.discord != discord ||
      project.slug != slug ||
      imageChanged ||
      coverChanged
    ) {
      return true;
    } else {
      return false;
    }
  }

  function onImageUpload(file) {
    setImage(file);
    if (!imageChanged) {
      setImageChanged(true);
    }
  }

  function onCoverUpload(file) {
    setCover(file);
    if (!coverChanged) {
      setCoverChanged(true);
    }
  }

  function onChangeName(e) {
    setName(e.target.value);
  }

  function onChangeDescription(e) {
    setDescription(e.target.value);
  }

  function onChangeTwitter(e) {
    if (e.target.value[e.target.value.length - 1] === "/") return;
    let slug = extractSlug(e.target.value);
    if (slug.match(regex.handle) || slug === "") {
      setTwitter(slug);
    }
  }

  function onChangeDiscord(e) {
    if (e.target.value[e.target.value.length - 1] === "/") return;
    let slug = extractSlug(e.target.value);
    if (slug.match(regex.alphanumeric) || slug === "") {
      setDiscord(slug);
    }
  }

  function onChangeWebsite(e) {
    let _str = e.target.value;
    if (_str.match(regex.website) || _str === "") {
      _str = _str.replace(/^https?:\/\/(?:www\.|(?!www))|^www\./, "");
    }
    setWebsite(_str);
  }

  function onChangeSlug(e) {
    if (e.target.value.match(regex.alphanumeric) || e.target.value === "") {
      setSlug(e.target.value);
    }
  }

  async function callUpdateProjectDetail() {
    setSaving(true);

    if (success) setSuccess(false);
    if (failed) setFailed(false);

    let files;
    if (imageChanged || coverChanged) {
      files = new FormData();
      if (imageChanged) files.append("image", image);
      if (coverChanged) files.append("cover", cover);
    } else {
      files = null;
    }

    const projectDetails = {
      uuid: project.uuid,
      name,
      description,
      website,
      twitter,
      discord,
      slug,
    };

    const res = await updateProjectDetails(address, projectDetails, files);
    if (res.success === true) {
      setSuccess(true);
      setProject(res.payload);
    } else {
      setFailed(true);
      if (res.message === "forbidden") {
        setErrorMessage("Only creator can edit the project");
      } else {
        setErrorMessage("Something wrong in our side, please try again.");
        console.log(res.message)
      }
    }
    setSaving(false);
  }

  return (
    <form onKeyDown={noSubmit}>
      <h1 className="text-tock-green font-bold text-xl mt-4 mb-6 ">
        details & description
      </h1>
      <LabeledInput
        value={name}
        id="project-name"
        type="text"
        placeholder="Cool NFT"
        onChange={onChangeName}
        required
      >
        Project name{" "}
        <span className="text-sm font-normal text-zinc-400">(required)</span>
      </LabeledInput>

      <div className="mb-10">
        <label className="block text-tock-blue text-sm font-bold mb-2">
          Project description
        </label>
        <textarea
          className="text-sm appearance-none resize-none h-28 bg-zinc-700 rounded-xl w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:ring focus:ring-2 focus:ring-zinc-500"
          id="project-description"
          maxLength={500}
          type="text"
          placeholder="some cool description for project (up to 500 words)"
          onChange={onChangeDescription}
        />
        <p className="text-xs text-end text-zinc-500">
          {description.length}/500
        </p>
      </div>

      <div className="mb-10">
        <label className="block text-tock-blue text-sm font-bold mb-2">
          Project website
        </label>
        <div className="flex">
          <input
            className="select-none flex-none text-sm appearance-none rounded-l-xl pointer-events-none bg-tock-semiblack border border-zinc-700 text-gray-400 py-3 px-3 w-36 leading-tight"
            value="https://"
            readOnly
            tabIndex="-1"
          />
          <input
            className="flex-1 text-sm appearance-none bg-zinc-700 rounded-r-xl py-3 px-3 text-gray-200 border border-zinc-700 leading-tight focus:outline-none w- focus:ring focus:ring-2 focus:ring-zinc-500"
            value={website}
            id="project-website"
            type="text"
            placeholder="website.cool"
            onChange={onChangeWebsite}
          />
        </div>
      </div>

      <div className="mb-10">
        <label className="block text-tock-blue text-sm font-bold mb-2">
          Twitter handle
        </label>
        <div className="flex">
          <input
            className="select-none flex-none text-sm appearance-none rounded-l-xl pointer-events-none bg-tock-semiblack border border-zinc-700 text-gray-400 py-3 px-3 w-36 leading-tight"
            value="twitter.com/"
            readOnly
            tabIndex="-1"
          />
          <input
            className="flex-1 text-sm appearance-none bg-zinc-700 rounded-r-xl py-3 px-3 text-gray-200 border border-zinc-700 leading-tight focus:outline-none w- focus:ring focus:ring-2 focus:ring-zinc-500"
            value={twitter}
            id="project-twitter"
            type="text"
            placeholder="@cooltwitter"
            onChange={onChangeTwitter}
          />
        </div>
      </div>

      <div className="mb-10">
        <label className="block text-tock-blue text-sm font-bold mb-2">
          Discord
        </label>
        <div className="flex">
          <input
            className="select-none flex-none text-sm appearance-none rounded-l-xl pointer-events-none bg-tock-semiblack border border-zinc-700 text-gray-400 py-3 px-3 w-36 leading-tight"
            value="discord.gg/"
            readOnly
            tabIndex="-1"
          />
          <input
            className="flex-1 text-sm appearance-none bg-zinc-700 rounded-r-xl py-3 px-3 text-gray-200 border border-zinc-700 leading-tight focus:outline-none w- focus:ring focus:ring-2 focus:ring-zinc-500"
            value={discord}
            id="project-discord"
            type="text"
            placeholder="cooldiscord"
            onChange={onChangeDiscord}
          />
        </div>
      </div>

      <div className="mb-10">
        <label className="block text-tock-blue text-sm font-bold mb-2">
          Tockable page
        </label>
        <div className="flex">
          <input
            tabIndex="-1"
            className="select-none flex-none text-sm appearance-none rounded-l-xl pointer-events-none bg-tock-semiblack border border-zinc-700 text-gray-400 py-3 px-3 w-36 leading-tight"
            value="tockable.xyz/c/"
            readOnly
          />
          <input
            className="flex-1 text-sm appearance-none bg-zinc-700 rounded-r-xl py-3 px-3 text-gray-200 border border-zinc-700 leading-tight focus:outline-none w- focus:ring focus:ring-2 focus:ring-zinc-500"
            value={slug}
            id="project-slug"
            type="text"
            placeholder="cool_slug"
            onChange={onChangeSlug}
          />
        </div>
      </div>
      <div id="project-image-uploader" className="mt-10">
        <label className="block text-tock-blue text-sm font-bold mb-2">
          Project image{" "}
          <span className="text-sm font-normal text-zinc-400">
            (Ratio 1 : 1, 2MB max)
          </span>
        </label>
        <div>
          <FileUploader
            name="file"
            types={projectImageFileTypes}
            maxSize={2}
            onSizeError={() => setImageSizeError(true)}
            onTypeError={() => setImageTypeError(true)}
            hoverTitle="Drop"
            handleChange={onImageUpload}
            children={
              <div className="border border-dashed border-zinc-200 rounded-xl text-sm text-zinc-500 h-24 text-center pt-8">
                <span className="mt-2">
                  Drag and drop, or just click in the box.
                </span>
              </div>
            }
            dropMessageStyle={{
              backgroundColor: "grey",
              color: "white",
              border: "1px dashed white",
              borderRadius: "12px",
            }}
          />
        </div>

        <button
          type="button"
          onClick={clearImage}
          className="transition ease-in-out duration-300 text-xs text-zinc-500 text-bold hover:text-tock-red"
        >
          Clear image
        </button>
        {imageSizeError && (
          <p className="text-tock-red text-xs">
            The file size should not exceed 2MB
          </p>
        )}
        {imageTypeError && (
          <p className="text-tock-red text-xs">
            Supported file types: png, jpg, webp
          </p>
        )}
        <div className="flex justify-center mt-2 mb-8">
          {showImage && (
            <img className="rounded-xl" src={imageToShow} width="200"></img>
          )}
        </div>
      </div>
      <div id="project-cover-uploader" className="mt-10 mb-10">
        <label className="block text-tock-blue text-sm font-bold mb-2">
          Project cover image{" "}
          <span className="text-sm font-normal text-zinc-400">
            (Ratio 4 : 1 landscape, 2MB max)
          </span>
        </label>
        <div>
          <FileUploader
            handleChange={onCoverUpload}
            name="file"
            maxSize={2}
            onSizeError={() => setCoverSizeError(true)}
            onTypeError={() => setCoverTypeError(true)}
            types={projectImageFileTypes}
            hoverTitle="Drop"
            children={
              <div className="border border-dashed border-zinc-200 rounded-xl text-sm text-zinc-500 h-24 text-center pt-8">
                <span className="mt-2">
                  Drag and drop, or just click in the box.
                </span>
              </div>
            }
            dropMessageStyle={{
              backgroundColor: "grey",
              color: "white",
              border: "1px dashed white",
              borderRadius: "12px",
            }}
          />
        </div>
        <button
          type="button"
          onClick={clearCover}
          className="transition ease-in-out duration-300 text-xs text-zinc-500 text-bold hover:text-tock-red"
        >
          Clear image
        </button>
        {coverSizeError && (
          <p className="text-tock-red text-xs">
            The file size should not exceed 2MB
          </p>
        )}
        {coverTypeError && (
          <p className="text-tock-red text-xs">
            Supported file types: png, jpg, webp
          </p>
        )}
        <div className="flex justify-center mt-2 mb-6">
          {showCover && (
            <img className="rounded-xl" src={coverToShow} width="600"></img>
          )}
        </div>
      </div>
      <Button
        variant="primary"
        type="button"
        disabled={saving || !updateNeeded()}
        onClick={() => {
          callUpdateProjectDetail();
        }}
      >
        Save
      </Button>
      {success && !updateNeeded() && (
        <p className="mt-2 text-xs text-tock-green">
          Project details successfully updated.
        </p>
      )}
      {failed && <p className="mt-2 text-xs text-tock-red">{errorMessage}</p>}
    </form>
  );
}
