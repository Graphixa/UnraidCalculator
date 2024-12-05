# Unraid Drive Calculator 

A quick and simple tool to help you figure out how different drive configurations will work with Unraid. With just a few clicks, you can see how changing the number of data and parity drives, as well as their sizes, affects your total usable storage and fault tolerance.

**Goto Unraid Calculator Tool:** [https://graphixa.github.io/UnraidCalculator/](https://graphixa.github.io/UnraidCalculator/)

![alt text](https://github.com/Graphixa/UnraidCalculator/blob/main/Demo.gif?raw=true)

## Why?

It’s a handy way to preview your storage setup before you commit to buying or rearranging drives.. and because every other unraid calculator is either broken or no longer available online.

## How It Works

1. **Select the Number of Data Drives**
   - Click on a preset data drive count (e.g., 1, 2, 4, etc.) to quickly set the total number of drives.
   - If you need more than 10 drives, click **"Custom No."** and enter a number between 11 and 100.

2. **Choose Data Drive Sizes**
   - For each data drive, specify its size and unit (TB or GB).
   - If all drives are the same size, click **"Update All Drive Sizes"** to quickly standardise their sizes and units.

3. **Set Parity Drives**
   - Select how many parity drives (0, 1, or 2) you’d like.
   - For parity drives, the calculator automatically enforces parity size requirements (parity drives must be at least as large as the largest data drive).

4. **Review**
   - **Usable Storage:** Shows how much total capacity remains after accounting for parity drives.
   - **Fault Tolerance:** Indicates how many drive failures you can tolerate without losing data.
   - **Total Drives:** Displays the total number of drives including both data and parity.

5. **Adjust and Experiment:**
   - Try different configurations, drive counts, and sizes to find the ideal setup for your Unraid server.
   - The results update in real-time, so you can instantly see how changes affect your storage and resiliency.

## Contributing

If you spot an issue, have an idea for a new feature, or just want to improve the UI, feel free to open an issue or submit a pull request. Feedback is always welcome.

Feel free to clone the repo and run locally on your computer if you want. 

## Forking & Hosting

Feel free to fork this project, make improvements, or even host your own version online. The goal is to make it as useful as possible, so if you think you can enhance it in any way, go right ahead.
