<p align="center">
<img src="./assets/logo.png">
</p>

---
# Quick Note - PLEASE READ
Hi! This project is a fork of the original Pensela repo (obviously) - I'll be uploading bugfixes and features here :)
Changelog since the original project can be found below.

# Pensela: The Swiss Army Knife of Screen Annotation Tools

***Note: This Project is no longer being mantained. If you want to take the role of a mantainer open an issue requesting the same and I'll assign it to you.***

## Features

-   Basic Shapes
    -   Rectangle
    -   Circle
    -   Triangle
    -   Lines (Straight and Freehand)
    -   Any Polygon
-   Stickers: Pre Added Shapes
    -   Star
    -   Cross
    -   Tick
    -   Single and Double Sided Arrows
-   Highlighter
-   Laser Pointer
-   Screenshot Tool
-   Text Support
-   Backgound Pages
-   Custom Color Picker &nbsp;
-   And More ...

## Screenshots

![Screenshot](./assets/screenshot2.png)
![Screenshot](./assets/screenshot1.png)

A Promo / Demo can be found [here](https://youtu.be/OzpgCw24ut8)

## Installation

**Packages can be Found in the [releases](https://github.com/weiameili/Pensela/releases) Section**

**Note**: Imagemagick is required for screenshots on linux and screenshots are not guaranteed to work on wayland as of now.

| OS                 | Instructions                                                                                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Debian Based Linux | A .deb archive has been provided                                                                                                                                      |
| Arch Linux         | Arch user can install the [pensela-bin](https://aur.archlinux.org/packages/pensela-bin/) aur package or the prebuilt package archive provided in the releases section |
| Other Linux        | An AppImage has been provided                                                                                                                                         |
| Windows            | Download and run the setup provided in the releases section. You will have to disable your antivirus and / or mark the setup as safe                                  |
| Mac OS             | A dmg has been provided. Or use Homebrew: `brew install --cask pensela`                                                                                               |

## Features to be Added in Future Versions

-   Better UX
-   Auto Updates
-   Guided "Getting Started" Tour
-   Add more Features
    -   Full-fledged Screen Recording Tool
    -   Better Text Support
    -   Seperate Colors For Stroke and Fill
    -   Better Laser Pointer

## Contributing

Any kind of contribution is welcome

1. Fork the Project
2. Install the dependencies with npm
3. Create your Feature Branch
4. Commit your Changes
5. Push to the Branch
6. Open a Pull Request

Feel free to report an issue or request a feature in the Issues Section.

### Conributors

<a href="https://github.com/weiameili/pensela/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=weiameili/pensela" />
</a>

## License

Distributed under the ISC License.

# Changelog

All notable changes to Pensela since I forked the project will be documented here.


## [V1.2.6] - 2025-06-11

### Added
- Multi-monitor support has been added (or fixed?) (2025-06-10)

### Fixed
- Screenshot functionality issues resolved by implementing custom fork of `screenshot-desktop`
- Updated dependencies to use forked version